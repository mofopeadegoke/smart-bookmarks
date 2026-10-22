# Smart Bookmarks — project context

Week 1 project of a 12-week self-directed sprint. The developer (Daniel) is a frontend engineer
(React, TypeScript, Vitest/Jest/RTL, TanStack Query) building full-stack and AI engineering skills.
The goal is learning, not just a finished app.

## How to work with Daniel

- **Explain in very simple terms**, especially backend, infra and AI parts. Use plain words and
  small analogies; define any jargon. Explain what each new file does and why.
- **Give complete code for new or replaced files**, not fragments, unless a change is a few lines.
- **Comments only explain *why*, when the code isn't obvious.** No comments restating what code does.
- **Use pnpm** (`pnpm add`, `pnpm dev`, `pnpm exec`, `pnpm dlx`). Never npm.
- Go one step at a time. Finish with a short test checklist, then wait for Daniel before the next step.
- If something about a library may have changed (Better Auth, Anthropic SDK, Next.js), check the docs.

## What the app does

Users sign in with GitHub, paste a link, and the app fetches the page, asks Claude for a
two-sentence summary and 3–5 tags (reusing the user's existing tags), and lets them filter by tag,
search, edit tags and re-analyze.

## Stack and key decisions

| Area | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js App Router, TypeScript, Tailwind | `cacheComponents` is ON: session and `searchParams` must be read inside `<Suspense>` |
| Database | Postgres on Neon, Drizzle ORM, `pg` driver (`drizzle-orm/node-postgres`) | `pg` chosen so CI can use a plain Postgres container and transactions work |
| Migrations | drizzle-kit (`pnpm db:generate`, `pnpm db:migrate`, `pnpm db:studio`) | `drizzle.config.ts` loads `.env.local` via dotenv |
| Auth | Better Auth (not Auth.js), GitHub OAuth only, `nextCookies()` plugin last | Auth tables in `db/auth-schema.ts`, re-exported from `db/schema.ts` |
| AI | `@anthropic-ai/sdk`, model `claude-haiku-5-5`, structured outputs via `output_config.format` (json_schema), `thinking: { type: "disabled" }` | Reply validated with Zod; one retry; token usage logged with `[ai]` prefix |
| Page fetching | `lib/safe-fetch.ts` with SSRF guards; `linkedom` + `@mozilla/readability` for extraction | Text truncated to 8,000 chars before sending to Claude |
| Background work | `after()` from `next/server` | Save returns instantly; analysis runs after the response |
| Polling | `components/auto-refresh.tsx` calls `router.refresh()` every 2s while any bookmark is pending | Chosen over TanStack Query since data comes from server components |
| Search | Generated `tsvector` column (`search`) with weights (title A, summary B), GIN index, `websearch_to_tsquery`, `ts_rank` ordering | Known gaps: accents must match exactly; Japanese/Chinese text can't be searched by word (see "Search in any language") |
| Filters | In the URL: `/?tag=react&q=caching` | `bookmarksHref()` in `lib/urls.ts` builds links |

## Data model (`db/schema.ts`)

- `user`, `session`, `account`, `verification` — Better Auth (`db/auth-schema.ts`)
- `bookmarks` — id (uuid), userId → user.id (cascade), url, title, summary,
  status enum `pending|ready|failed`, error, createdAt, search (generated tsvector).
  Unique (userId, url).
- `tags` — id, userId → user.id (cascade), name. Unique (userId, name).
- `bookmark_tags` — bookmarkId, tagId (both cascade), composite primary key.

## Files so far

```
db/index.ts, db/schema.ts, db/auth-schema.ts, drizzle.config.ts, drizzle/ (migrations)
lib/auth.ts            Better Auth config
lib/auth-client.ts     createAuthClient() for the browser
lib/session.ts         getCurrentUser(), requireUser()
lib/urls.ts            normalizeUrl(), bookmarksHref()
lib/safe-fetch.ts      assertPublicUrl(), fetchPage() — 8s timeout, 2MB cap, manual redirects (max 5), HTML only
lib/extract.ts         extractContent(html) → { title, text }
lib/ai.ts              analyze() — real Claude, or fakeAnalyze when AI_MODE=fake
lib/tags.ts            cleanTag() (Unicode letters kept, NFC, single dashes, 30 chars), attachTag(executor, userId, bookmarkId, name)
lib/analyze.ts         analyzeBookmark(id): fetch → extract → AI → transaction saving tags + summary
lib/queries.ts         getBookmarks(userId, {q, tag}), getTagCounts(userId), getTagsByBookmark(userId)
app/actions.ts         saveBookmark, deleteBookmark, addTag, removeTag, reanalyzeBookmark
app/api/auth/[...all]/route.ts
app/page.tsx           Page → Suspense → Home (reads session + searchParams) → Suspense(key=filter) → BookmarkList
components/            auth-buttons, add-bookmark-form, auto-refresh, search-box, tag-filter,
                       bookmark-tags, bookmark-list (+ BookmarkListSkeleton),
                       spinner, form-button (submit with spinner via useFormStatus),
                       delete-button (also fades its card via data-pending)
```

## Rules the code follows

- Every query and action scopes by the session user (`requireUser()`), never by an ID from the browser.
- URLs are checked with `assertPublicUrl` both before saving (fast feedback) and on every fetch/redirect.
- Page text and AI replies are untrusted: system prompt says page content is data; replies go through Zod.
- `reanalyzeBookmark` skips bookmarks already pending, so double clicks don't start two runs.
- Re-analyzing replaces a bookmark's tags, including manually added ones (known, accepted for now).
- Known gap: DNS rebinding (DNS is checked, then `fetch` resolves again). Planned fix later: pin the checked IP.

## Env vars (`.env.local`)

`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`,
`ANTHROPIC_API_KEY`, optional `AI_MODE=fake`.

## Status

Steps 0–7 are done and working: setup, database, sign-in, saving, safe fetching, AI summaries and
tags, tag filter and search with loading states, editing tags and re-analyze.

## Remaining steps

### Step 8 — Tests
- Vitest unit tests for the logic most likely to break:
  - `normalizeUrl` (adds https, rejects junk, strips hash, rejects non-http)
  - `cleanTag` (spaces → dashes, lowercase, symbols, length)
  - `assertPublicUrl` rejects `127.0.0.1`, `10.0.0.1`, `192.168.1.1`, `169.254.169.254`, `::1`,
    `file://`, non-existent hosts (mock `node:dns/promises` lookup so tests don't need network)
  - AI reply validation: refactor so the Zod schema/parse is exported and testable; cover bad shapes,
    duplicate and messy tags, more than 5 tags
- Never call the real Claude API in tests; use `AI_MODE=fake`.
- Playwright end-to-end: 3+ flows (save link → ready with summary/tags; filter by tag; search; delete).
  Needs a way to sign in without GitHub in tests — e.g. a test-only sign-in enabled only by an env var
  (never in production), or seed a session row directly. Explain the trade-off to Daniel.
- Add scripts: `test`, `test:e2e`, `typecheck`.

### After Step 8 — Search in any language
Tags already accept any language. Search does not yet (checked against the database):
- `cafe` doesn't find `café`. Fix: `unaccent` extension. A generated column needs an IMMUTABLE
  function, so wrap `unaccent('unaccent', …)` in our own immutable SQL function.
- Japanese/Chinese have no spaces, so the `english` parser stores a whole sentence as one word and
  `日本語` doesn't match `日本語の記事です`. Fix: `pg_trgm` trigram index on title/summary, used alongside
  the tsvector search (e.g. `OR title ILIKE '%q%'` backed by a GIN trigram index).
- Both need a migration; add tests with accented, Cyrillic and CJK titles.

### Step 9 — CI (GitHub Actions)
- On push and pull request: install with pnpm (`pnpm/action-setup` + `actions/setup-node` with pnpm cache),
  lint, typecheck, run migrations against a `postgres:16` service container, unit tests,
  build, Playwright (chromium only). `AI_MODE=fake` in CI. Secrets only where needed.

### Step 10 — Deploy (Vercel + Neon)
- Import the repo in Vercel (auto-detects pnpm).
- Separate Neon production branch/database.
- Second GitHub OAuth app with production callback URL `https://<app>/api/auth/callback/github`.
- Set all env vars in Vercel; `BETTER_AUTH_URL` = production URL.
- Run migrations against production on merge to `main` (CI step with a production `DATABASE_URL` secret).
- Check `after()` work completes within Vercel function limits.

### Weekend — Polish and ship
- Edge cases, empty states, keyboard access, a quick performance pass.
- README: what it does, architecture sketch, how to run locally, key decisions, demo GIF.
- Short write-up on one hard decision (e.g. SSRF guards, or save-first/analyze-later).

### "Done" checklist
- [ ] Live URL, sign-in works, data is per user
- [ ] Save, analyze, tag, search, edit and delete all work
- [ ] Unit tests for parsing/validation, plus 3+ Playwright flows
- [ ] CI runs lint, typecheck and tests on every push; deploy on merge
- [ ] SSRF guards have their own tests
- [ ] README with architecture sketch and demo GIF; short post on one hard decision

### Optional, only if ahead of schedule
- Edit titles; "keep my manual tags" on re-analyze; DNS rebinding fix; save from the Inscribe extension.
- Do not build "related bookmarks" with embeddings — that is week 4.
