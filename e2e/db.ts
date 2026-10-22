import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { Pool } from "pg";
import * as schema from "@/db/schema";

export const E2E_USER = { id: "e2e-user", name: "E2E User", email: "e2e@example.com" };

// These helpers delete data, so refuse anything that isn't a local *_test database.
function testDatabaseUrl() {
  const raw = process.env.DATABASE_URL ?? "";
  const url = new URL(raw);
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (!local || !url.pathname.endsWith("_test")) {
    throw new Error(
      `Refusing to run e2e tests against ${url.host}${url.pathname}. Use a local *_test database (see .env.test).`,
    );
  }
  return raw;
}

export function connect() {
  const pool = new Pool({ connectionString: testDatabaseUrl() });
  return { pool, db: drizzle(pool, { schema }) };
}

type Db = ReturnType<typeof connect>["db"];

export async function resetBookmarks(db: Db) {
  await db.delete(schema.bookmarks).where(eq(schema.bookmarks.userId, E2E_USER.id));
  await db.delete(schema.tags).where(eq(schema.tags.userId, E2E_USER.id));
}

type SeedBookmark = { url: string; title: string; summary: string; tags: string[] };

// Inserts finished ("ready") bookmarks directly, so filter/search/delete tests skip the slow analysis.
export async function seedBookmarks(db: Db, items: SeedBookmark[]) {
  for (const item of items) {
    const [bookmark] = await db
      .insert(schema.bookmarks)
      .values({
        userId: E2E_USER.id,
        url: item.url,
        title: item.title,
        summary: item.summary,
        status: "ready",
      })
      .returning();

    for (const name of item.tags) {
      const [tag] = await db
        .insert(schema.tags)
        .values({ userId: E2E_USER.id, name })
        .onConflictDoUpdate({ target: [schema.tags.userId, schema.tags.name], set: { name } })
        .returning();
      await db.insert(schema.bookmarkTags).values({ bookmarkId: bookmark.id, tagId: tag.id });
    }
  }
}
