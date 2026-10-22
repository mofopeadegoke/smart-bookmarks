import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookmarkTags, tags } from "@/db/schema";

export function cleanTag(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9+#.-]/g, "")
    .slice(0, 30);
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
