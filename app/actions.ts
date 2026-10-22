"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { normalizeUrl } from "@/lib/urls";
import { analyzeBookmark } from "@/lib/analyze";
import { assertPublicUrl } from "@/lib/safe-fetch";

export type SaveState = { error?: string; ok?: boolean };

export async function saveBookmark(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  // 1. Who is this? (stops here if not signed in)
  const user = await requireUser();

  // 2. Is it a real link?
  const url = normalizeUrl(String(formData.get("url") ?? ""));
  if (!url) return { error: "That doesn't look like a web link." };

  try {
    await assertPublicUrl(url);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "This link isn't allowed.",
    };
  }

  // 3. Save it. If this user already saved this link, the database skips it.
  const [row] = await db
    .insert(bookmarks)
    .values({ userId: user.id, url })
    .onConflictDoNothing()
    .returning();

  if (!row) return { error: "You've already saved this link." };

  // 4. Do the slow work AFTER replying to the user
  after(() => analyzeBookmark(row.id));

  // 5. Tell Next.js the page's data changed, so it shows the new bookmark
  revalidatePath("/");
  return { ok: true };
}

export async function deleteBookmark(bookmarkId: string) {
  const user = await requireUser();

  // Delete only if it belongs to this user. Someone can't delete
  // another person's bookmark by guessing its ID.
  await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.userId, user.id)));

  revalidatePath("/");
}
