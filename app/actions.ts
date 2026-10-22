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
