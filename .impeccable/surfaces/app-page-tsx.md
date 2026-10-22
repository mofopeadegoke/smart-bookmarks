---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["components/bookmark-list.tsx"]
---

# Surface: the app (signed-out welcome + signed-in bookmarks workspace)

Mode: Operate. Build path: code-led.
Audience: Daniel daily (desktop + phone) and portfolio viewers. Job: save fast, find later.
Constraints: keep every label/role the e2e tests use (Link to save, Save, Search bookmarks, Search,
Filter by tag nav, Clear, Delete, "N result(s)", "No bookmarks yet", Sign in with GitHub). Light + dark.

## Direction contract

THESIS: A personal workspace, not a list page. Notion's page-and-sidebar structure with database-style
properties, warmed by Miro's canvas: dotted board ground, sticky-note colour and a bright yellow
action colour. Refuses the plain centred column with grey cards.

OWN-WORLD: Warm off-white page (#FBFAF7) on a faint dot grid; sidebar a step darker. Ink #262420.
One bold action yellow (#FFD02F) with ink text for Save and the active tag. Tags use a fixed set of
nine soft property colours (grey, brown, orange, yellow, green, blue, purple, pink, red), each a pale
pill with a darker dot. Cards are white, 12px radius, hairline border, a soft lift on hover. Type: Onest,
bold page title, regular body at a 66ch measure. Dark: #191918 ground, #202020 sidebar, same hues muted.

STORY: You see your workspace, paste a link, watch a sticky "Claude is reading…" note turn into a
card with a summary and coloured tags, then click a tag or search to narrow down.

FIRST VIEWPORT: Left sidebar 264px: brand mark + name, "All bookmarks" with count, Tags section listing
each tag with its colour dot and count (the Filter by tag nav), user + sign out at the bottom. Main:
page icon 🔖 at 56px, title "Bookmarks" 40px bold, a one-line property row (count · last saved). Save bar
(input + yellow Save) full width under the title, search under it. Cards in a two-column board on the
dot grid. Phone: sidebar becomes a top bar plus a horizontal tag strip; cards one column.

FORM: Pinned by the user (Miro/Notion reference bar), replacing roll 90afd822's assignment; canon path.
Signature interaction: pending bookmark is a yellow sticky note with typing dots; when ready it
settles into a white card and its tag pills pop in.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
