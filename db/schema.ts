import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  uuid,
  primaryKey,
  unique,
  index,
  customType,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
export * from "./auth-schema";

// Drizzle has no built-in tsvector type
const tsvector = customType<{ data: string }>({
  dataType: () => "tsvector",
});

export const bookmarkStatus = pgEnum("bookmark_status", [
  "pending",
  "ready",
  "failed",
]);

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    title: text("title"),
    summary: text("summary"),
    status: bookmarkStatus("status").notNull().default("pending"),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    // Title matches rank above summary matches
    search: tsvector("search").generatedAlwaysAs(
      sql`setweight(to_tsvector('english', coalesce(title, '')), 'A') || setweight(to_tsvector('english', coalesce(summary, '')), 'B')`,
    ),
  },
  (t) => [
    unique().on(t.userId, t.url),
    index("bookmarks_search_idx").using("gin", t.search),
  ],
);
export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
  },
  (t) => [unique().on(t.userId, t.name)],
);

export const bookmarkTags = pgTable(
  "bookmark_tags",
  {
    bookmarkId: uuid("bookmark_id")
      .notNull()
      .references(() => bookmarks.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.bookmarkId, t.tagId] })],
);
