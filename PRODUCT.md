# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Daniel, the builder and daily user.** Saves links throughout the day and comes back later to find
  them again. Uses it on desktop and on his phone.
- **Portfolio viewers** (recruiters, peers) opening it from Daniel's portfolio to judge his
  full-stack and AI engineering craft. They sign in with GitHub, save a link or two, and look around.
- **Later: other people using it for real.** Sign-up stays open to anyone with GitHub, so AI cost must
  stay bounded: a monthly spend limit on the Anthropic account and a per-user daily analysis limit
  before the app is shared beyond the portfolio. Saving a link always works, even when AI is limited.

## Product Purpose

Save a link and let AI do the filing. The app fetches the page, asks Claude for a two-sentence summary
and 3–5 tags (reusing tags the user already has), and makes the collection searchable and filterable.
Success: saving takes seconds, and finding something later is faster than remembering where it was.

## Positioning

The user never organises anything by hand. Summaries and tags arrive on their own a few seconds after
saving, and tag reuse keeps the collection tidy as it grows.

## Operating Context

- **Quick save (desktop, phone):** paste a link mid-task, see it accepted, get back to work. Analysis
  finishes in the background; the list updates itself while anything is pending.
- **Review and find (desktop):** search titles and summaries, filter by tag, reread summaries, fix tags,
  re-analyze, delete.
- **First visit (portfolio viewer):** signed-out screen, then GitHub sign-in, then usually an empty list.

## Capabilities and Constraints

- GitHub sign-in only (Better Auth). Data is strictly per user.
- Bookmark states: `pending` (analyzing), `ready` (summary + tags), `failed` (with an error message).
- Tags: any language, lowercase, dashes, max 30 characters; add/remove by hand; re-analyze replaces them.
- Search over titles and summaries; filter by one tag; both live in the URL (`/?tag=…&q=…`).
- Next.js App Router with `cacheComponents`; Tailwind v4; mostly server components.
- E2E tests find elements by label, role and visible text. Changing labels, button names or the
  "N results" / "No bookmarks yet" copy means updating `e2e/bookmarks.spec.ts`.

## Brand Commitments

- Light and dark themes are both required.
- Reference bar (chosen by Daniel, 2026-10-22): the feel and distinctiveness of **Miro** and **Notion**.
  Rich, friendly, crafted workspace UI, not plain or minimal. Their craft level is the bar; their logos,
  names and exact brand assets are not used.
- Rejected directions: plain/minimal SaaS, dense developer-tool looks, costume metaphors (transit maps,
  spectrograms, departure boards).
- The working name is "Smart Bookmarks".

## Evidence on Hand

No logo, illustrations, screenshots or testimonials exist. Do not invent usage numbers or users.

## Product Principles

1. Saving is instant; waiting happens in the background and is always visible.
2. The summary is the content. A bookmark should be recognisable without opening the link.
3. Tags are a tool for finding, not decoration.
4. Works one-handed on a phone as well as on a desktop.
5. Every action shows that it is working (loading states are part of the product).
