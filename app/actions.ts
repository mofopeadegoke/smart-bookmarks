"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { bookmarks, bookmarkTags, tags } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { normalizeUrl } from "@/lib/urls";
import { analyzeBookmark } from "@/lib/analyze";
import { assertPublicUrl } from "@/lib/safe-fetch";
import { attachTag, cleanTag } from "@/lib/tags";

export type SaveState = { error?: string; ok?: boolean };

export async function saveBookmark(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const user = await requireUser();

  const url = normalizeUrl(String(formData.get("url") ?? ""));
  if (!url) return { error: "That doesn't look like a web link." };

  try {
    await assertPublicUrl(url);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "This link isn't allowed.",
    };
  }

  const [row] = await db
    .insert(bookmarks)
    .values({ userId: user.id, url })
    .onConflictDoNothing()
    .returning();

  // No row back means this user already saved this URL.
  if (!row) return { error: "You've already saved this link." };

  // Analysis takes seconds; reply to the user first.
  after(() => analyzeBookmark(row.id));

  revalidatePath("/");
  return { ok: true };
}

export async function deleteBookmark(bookmarkId: string) {
  const user = await requireUser();

  // Scoped by userId so nobody can delete someone else's bookmark by guessing its ID.
  await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.userId, user.id)));

  revalidatePath("/");
}

export async function addTag(bookmarkId: string, formData: FormData) {
  const user = await requireUser();
  const name = cleanTag(String(formData.get("tag") ?? ""));
  if (!name) return;

  const [owned] = await db
    .select({ id: bookmarks.id })
    .from(bookmarks)
    .where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.userId, user.id)));
  if (!owned) return;

  await attachTag(db, user.id, bookmarkId, name);
  revalidatePath("/");
}

export async function removeTag(bookmarkId: string, tagName: string) {
  const user = await requireUser();

  const [tag] = await db
    .select({ id: tags.id })
    .from(tags)
    .where(and(eq(tags.userId, user.id), eq(tags.name, tagName)));
  if (!tag) return;

  // Safe without a bookmark ownership check: this user's tags are only ever linked to their own bookmarks.
  await db
    .delete(bookmarkTags)
    .where(and(eq(bookmarkTags.bookmarkId, bookmarkId), eq(bookmarkTags.tagId, tag.id)));

  revalidatePath("/");
}

export async function reanalyzeBookmark(bookmarkId: string) {
  const user = await requireUser();

  // One conditional update: a double click, or someone else's ID, matches no row.
  const [row] = await db
    .update(bookmarks)
    .set({ status: "pending", error: null })
    .where(
      and(
        eq(bookmarks.id, bookmarkId),
        eq(bookmarks.userId, user.id),
        ne(bookmarks.status, "pending"),
      ),
    )
    .returning({ id: bookmarks.id });
  if (!row) return;

  after(() => analyzeBookmark(row.id));
  revalidatePath("/");
}
