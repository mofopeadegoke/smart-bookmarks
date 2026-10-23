ALTER TABLE "bookmarks" drop column "search";--> statement-breakpoint
ALTER TABLE "bookmarks" ADD COLUMN "search" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('english', immutable_unaccent(coalesce(title, ''))), 'A') || setweight(to_tsvector('english', immutable_unaccent(coalesce(summary, ''))), 'B')) STORED;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD COLUMN "search_text" text GENERATED ALWAYS AS (lower(immutable_unaccent(coalesce(title, '') || ' ' || coalesce(summary, '')))) STORED;--> statement-breakpoint
CREATE INDEX "bookmarks_search_text_idx" ON "bookmarks" USING gin ("search_text" gin_trgm_ops);--> statement-breakpoint
-- Dropping "search" above also dropped its index; drizzle-kit does not recreate it.
CREATE INDEX "bookmarks_search_idx" ON "bookmarks" USING gin ("search");