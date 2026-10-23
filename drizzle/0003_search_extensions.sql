CREATE EXTENSION IF NOT EXISTS unaccent;--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
-- unaccent() is only STABLE (its dictionary could change), but generated columns and indexes need IMMUTABLE.
-- Naming the dictionary and schema explicitly makes the result fixed, so promising IMMUTABLE is safe.
CREATE OR REPLACE FUNCTION immutable_unaccent(text) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
  RETURN public.unaccent('public.unaccent'::regdictionary, $1);
