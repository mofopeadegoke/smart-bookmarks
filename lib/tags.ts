import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookmarkTags, tags } from "@/db/schema";

export function cleanTag(tag: string) {
  const cleaned = tag
    // "é" can arrive as one character or as "e" + an accent mark; NFC makes them the same tag.
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}+#.-]/gu, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
  // Slice by character, not UTF-16 unit, so a 30-char cut never splits a character in half.
  return Array.from(cleaned).slice(0, 30).join("");
}

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

// Takes either `db` or a transaction, so analyze.ts can attach tags all-or-nothing.
export async function attachTag(
  executor: typeof db | Transaction,
  userId: string,
  bookmarkId: string,
  name: string,
) {
  await executor.insert(tags).values({ userId, name }).onConflictDoNothing();

  const [tag] = await executor
    .select({ id: tags.id })
    .from(tags)
    .where(and(eq(tags.userId, userId), eq(tags.name, name)));

  await executor
    .insert(bookmarkTags)
    .values({ bookmarkId, tagId: tag.id })
    .onConflictDoNothing();
}
