import { and, count, desc, eq, inArray, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { bookmarks, bookmarkTags, tags } from "@/db/schema";

type Filters = { q?: string; tag?: string };

export async function getBookmarks(userId: string, { q, tag }: Filters) {
  const conditions: SQL[] = [eq(bookmarks.userId, userId)];

  // Accepts search-engine syntax like: react -native "server components"
  const searchQuery = sql`websearch_to_tsquery('english', ${q ?? ""})`;

  if (q) {
    conditions.push(sql`${bookmarks.search} @@ ${searchQuery}`);
  }

  if (tag) {
    const withTag = db
      .select({ id: bookmarkTags.bookmarkId })
      .from(bookmarkTags)
      .innerJoin(tags, eq(bookmarkTags.tagId, tags.id))
      .where(and(eq(tags.userId, userId), eq(tags.name, tag)));

    conditions.push(inArray(bookmarks.id, withTag));
  }

  return db
    .select({
      id: bookmarks.id,
      url: bookmarks.url,
      title: bookmarks.title,
      summary: bookmarks.summary,
      status: bookmarks.status,
      error: bookmarks.error,
    })
    .from(bookmarks)
    .where(and(...conditions))
    .orderBy(
      ...(q
        ? [
            desc(sql`ts_rank(${bookmarks.search}, ${searchQuery})`),
            desc(bookmarks.createdAt),
          ]
        : [desc(bookmarks.createdAt)]),
    );
}

export async function getTagCounts(userId: string) {
  return (
    db
      .select({ name: tags.name, count: count(bookmarkTags.bookmarkId) })
      .from(tags)
      // Inner join drops tags no bookmark uses anymore
      .innerJoin(bookmarkTags, eq(bookmarkTags.tagId, tags.id))
      .where(eq(tags.userId, userId))
      .groupBy(tags.id, tags.name)
      .orderBy(desc(count(bookmarkTags.bookmarkId)), tags.name)
  );
}

export async function getTagsByBookmark(userId: string) {
  const rows = await db
    .select({ bookmarkId: bookmarkTags.bookmarkId, name: tags.name })
    .from(bookmarkTags)
    .innerJoin(tags, eq(bookmarkTags.tagId, tags.id))
    .where(eq(tags.userId, userId));

  const map = new Map<string, string[]>();
  for (const { bookmarkId, name } of rows) {
    const list = map.get(bookmarkId) ?? [];
    list.push(name);
    map.set(bookmarkId, list);
  }
  return map;
}
