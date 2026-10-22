import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookmarks, bookmarkTags, tags } from "@/db/schema";
import { fetchPage } from "@/lib/safe-fetch";
import { extractContent } from "@/lib/extract";
import { analyze } from "@/lib/ai";

const MAX_TEXT = 8_000; // about 2,000 tokens: enough to understand the page, cheap to send

export async function analyzeBookmark(bookmarkId: string) {
  try {
    const [bookmark] = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.id, bookmarkId));
    if (!bookmark) return;

    const { html } = await fetchPage(bookmark.url);
    const { title, text } = extractContent(html);
    if (!text) throw new Error("Couldn't find any text on this page");

    // So Claude reuses existing tags instead of inventing near-duplicates.
    const existing = await db
      .select({ name: tags.name })
      .from(tags)
      .where(eq(tags.userId, bookmark.userId))
      .limit(200);

    const result = await analyze({
      title,
      text: text.slice(0, MAX_TEXT),
      existingTags: existing.map((t) => t.name),
    });

    // One transaction: a bookmark must never end up with half its tags.
    await db.transaction(async (tx) => {
      // Matters when a bookmark is re-analyzed.
      await tx
        .delete(bookmarkTags)
        .where(eq(bookmarkTags.bookmarkId, bookmarkId));

      for (const name of result.tags) {
        await tx
          .insert(tags)
          .values({ userId: bookmark.userId, name })
          .onConflictDoNothing();

        const [tag] = await tx
          .select({ id: tags.id })
          .from(tags)
          .where(and(eq(tags.userId, bookmark.userId), eq(tags.name, name)));

        await tx
          .insert(bookmarkTags)
          .values({ bookmarkId, tagId: tag.id })
          .onConflictDoNothing();
      }

      await tx
        .update(bookmarks)
        .set({ title, summary: result.summary, status: "ready", error: null })
        .where(eq(bookmarks.id, bookmarkId));
    });
  } catch (err) {
    await db
      .update(bookmarks)
      .set({
        status: "failed",
        error: err instanceof Error ? err.message : "Something went wrong",
      })
      .where(eq(bookmarks.id, bookmarkId));
  }
}
