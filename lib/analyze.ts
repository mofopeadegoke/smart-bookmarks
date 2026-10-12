import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";

// STAND-IN for the real AI (Step 5).
// Waits 3 seconds, then fills in a fake title and summary.
export async function analyzeBookmark(bookmarkId: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const [bookmark] = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.id, bookmarkId));
    if (!bookmark) return; // it was deleted while we waited

    await db
      .update(bookmarks)
      .set({
        title: new URL(bookmark.url).hostname,
        summary: "The real AI summary arrives in Step 5.",
        status: "ready",
      })
      .where(eq(bookmarks.id, bookmarkId));
  } catch (err) {
    // If anything goes wrong, mark it failed instead of leaving it stuck on "pending"
    await db
      .update(bookmarks)
      .set({
        status: "failed",
        error: err instanceof Error ? err.message : "Unknown error",
      })
      .where(eq(bookmarks.id, bookmarkId));
  }
}
