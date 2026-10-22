---
name: Smart Bookmarks
description: A warm, sticky-note workspace where saved links file themselves.
colors:
  canvas: "#faf9f7"
  board-dot: "#dfdcd5"
  sidebar: "#f2f1ee"
  surface: "#ffffff"
  hover: "#ebe9e4"
  ink: "#262420"
  ink-2: "#625e56"
  ink-3: "#6a665d"
  line: "#e6e3dd"
  action-yellow: "#ffd02f"
  action-yellow-hover: "#f5c400"
  accent-ink: "#262420"
  sticky: "#fff1a8"
  sticky-ink: "#5c4a00"
  danger: "#b42d1a"
  danger-bg: "#fdebe7"
  focus: "#2f6bff"
  selection: "#ffe58a"
  tag-grey-bg: "#eeedea"
  tag-grey-dot: "#9b9a97"
  tag-grey-ink: "#46443f"
  tag-brown-bg: "#f1e7e1"
  tag-brown-dot: "#a27763"
  tag-brown-ink: "#5e4436"
  tag-orange-bg: "#fbe6d5"
  tag-orange-dot: "#e07b39"
  tag-orange-ink: "#7a3e12"
  tag-yellow-bg: "#fbf0cc"
  tag-yellow-dot: "#d9a514"
  tag-yellow-ink: "#6b5000"
  tag-green-bg: "#ddeee3"
  tag-green-dot: "#4d9a6a"
  tag-green-ink: "#1f5634"
  tag-blue-bg: "#dcebf7"
  tag-blue-dot: "#3e86c8"
  tag-blue-ink: "#174a75"
  tag-purple-bg: "#ebe2f5"
  tag-purple-dot: "#9065c6"
  tag-purple-ink: "#4c2c78"
  tag-pink-bg: "#f7e0ec"
  tag-pink-dot: "#cf5a97"
  tag-pink-ink: "#7a2350"
  tag-red-bg: "#fbe1de"
  tag-red-dot: "#d9534a"
  tag-red-ink: "#7e211b"
typography:
  display:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  body-lead:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  group-label:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "0.025em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  hairline: "2px"
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "20px"
  xl: "24px"
  page-x: "40px"
  page-x-phone: "16px"
  sidebar-width: "264px"
components:
  button-primary:
    backgroundColor: "{colors.action-yellow}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.action-yellow-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.hover}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "0 20px"
    height: "48px"
  button-icon:
    textColor: "{colors.ink-3}"
    rounded: "{rounded.lg}"
    size: "32px"
  button-icon-hover:
    backgroundColor: "{colors.hover}"
    textColor: "{colors.ink}"
  button-icon-danger-hover:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger}"
  input-save-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "8px"
  input-search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "0 12px"
    height: "40px"
  nav-item:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.lg}"
    padding: "6px 10px"
  nav-item-hover:
    backgroundColor: "{colors.hover}"
    textColor: "{colors.ink}"
  nav-item-active:
    backgroundColor: "{colors.action-yellow}"
    textColor: "{colors.accent-ink}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "20px"
  card-pending:
    backgroundColor: "{colors.sticky}"
    textColor: "{colors.sticky-ink}"
    rounded: "{rounded.2xl}"
    padding: "20px"
  tag-pill:
    backgroundColor: "{colors.tag-blue-bg}"
    textColor: "{colors.tag-blue-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
  host-tile:
    backgroundColor: "{colors.tag-green-bg}"
    textColor: "{colors.tag-green-ink}"
    rounded: "{rounded.lg}"
    size: "36px"
  brand-tile:
    backgroundColor: "{colors.action-yellow}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.lg}"
    size: "28px"
  brand-tile-lg:
    backgroundColor: "{colors.action-yellow}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.2xl}"
    size: "56px"
  error-note:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger}"
    rounded: "{rounded.xl}"
    padding: "10px 12px"
---

# Design System: Smart Bookmarks

## Overview

**Creative North Star: "The Sticky-Note Workspace"**

Smart Bookmarks is a personal workspace, not a list page. The structure is Notion's: a quiet sidebar of pages and tags beside a page with a big icon, a bold title and a row of database-style properties. The warmth is Miro's: the page sits on a faint dotted board, work in progress is a yellow sticky note, and one bright yellow carries every primary action. Everything else is warm off-white, warm grey ink and white cards with hairline borders and soft shadows.

Density is comfortable rather than compact. Cards hold a recognisable summary and a few coloured tag pills, and the two-column board leaves the dot grid visible between them. The one authored moment is the hand-off from AI to user: a pending bookmark is a sticky note with typing dots, and when analysis finishes it settles into a white card and its tags pop in one by one.

The system rejects the plain centred column with grey cards, dense developer-tool looks and costume metaphors. Light and dark themes are both first-class; dark keeps the same hues, muted, on a near-black warm ground.

**Key Characteristics:**
- Warm off-white canvas with a 22px dot grid; sidebar one step darker.
- One action yellow for Save, the active filter, the brand tile and the avatar.
- Nine soft tag tones, each a pale pill with a darker dot, chosen by hashing the tag name.
- White 16px-radius cards with a hairline border and a two-layer soft shadow that lifts on hover.
- Onest throughout; bold, tightly tracked titles over regular 15px body copy.
- Motion is reserved for waiting and arriving: typing dots, the sticky-to-card settle and the tag pop.

## Colors

A warm neutral world with one loud yellow, a sticky-note pale yellow for waiting, nine muted property tones for tags, and a single cool blue kept only for keyboard focus.

### Primary
- **Action Yellow** (`action-yellow`): Save button, the active sidebar filter, the brand tile, the user avatar and native form accents. Always paired with Accent Ink text, never with white. Hover deepens to **Action Yellow Hover** in light mode and brightens in dark (#ffdb5c).
- **Accent Ink** (`accent-ink`): text and icons on yellow. In dark mode it is a touch deeper (#1f1d1a) so yellow stays legible.

### Secondary
- **Sticky Note** (`sticky`) with **Sticky Ink** (`sticky-ink`): the pending bookmark card and the "Claude is reading this page" note on the welcome board; also the start frame of the settle animation. Dark: #4a3f12 ground with #ffe58a ink.
- **Highlighter** (`selection`): text selection only. Dark: #6b5a12.

### Tertiary
- **Tag Tones** (`tag-<tone>-bg / -dot / -ink`, nine tones: grey, brown, orange, yellow, green, blue, purple, pink, red): tag pills, the active-tag chip in the results line, sidebar tag dots, and the host-initial tile on each card. Each tone is a pale background, a saturated dot and a dark ink. Dark mode swaps to a deep tinted background, a slightly brighter dot and a pale ink (see `app/globals.css`).

### Neutral
- **Warm Paper** (`canvas`): page ground under the dot grid. Dark: #191918.
- **Board Dot** (`board-dot`): the 1.2px dots of the board and the scrollbar thumb. Dark: #2e2d2b.
- **Sidebar Stone** (`sidebar`): sidebar and phone top bar, one step darker than the canvas. Dark: #202020.
- **Card White** (`surface`): cards, the save bar, search field, secondary buttons. Dark: #252524.
- **Hover Stone** (`hover`): hover fill for nav items, icon buttons and secondary buttons. Dark: #2f2f2d.
- **Warm Ink** (`ink`): headings, titles, input text, the GitHub sign-in button fill. Dark: #edebe6.
- **Ink 2** (`ink-2`): summaries, nav labels, property row, body copy. Dark: #b0aca3.
- **Ink 3** (`ink-3`): metadata (URL, date, counts), placeholders, icons at rest, the sidebar group label. Dark: #9a968d.
- **Hairline** (`line`): card, field and sidebar borders, skeleton blocks. Dark: #353432.
- **Danger** (`danger`) on **Danger Wash** (`danger-bg`): failed-analysis note, form errors, delete-button hover. Dark: #ff8a78 on #3a1e1a.
- **Focus Blue** (`focus`): the 2px focus outline, offset 2px, on every focusable element. Dark: #6b95ff.

### Named Rules
**The One Yellow Rule.** Action Yellow marks the thing you act with or the place you are: Save, the active filter, the brand tile. Never use it for decoration, body text or large fills.

**The Tags-Only Tones Rule.** The nine tones belong to tags and the host tiles that echo them. They are never used for buttons, states or page chrome, and a tag's tone always comes from hashing its name (`lib/tag-colors.ts`), so it is identical everywhere and on every visit.

**The Focus-Is-Blue Rule.** Blue is the only cool hue in the system and it means keyboard focus. Do not use it for links, selection or decoration.

## Typography

**Display Font:** Onest (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Onest
**Label/Mono Font:** Onest with tabular numerals for counts and dates

**Character:** One friendly geometric-humanist sans carries everything; hierarchy comes from weight and tight tracking on titles, not from a second family. Loaded with Latin, Latin Extended and Cyrillic subsets because tags and titles arrive in any language.

### Hierarchy
- **Display** (700, 3.75rem; 3rem on phone, line-height 1.05, tracking -0.025em, balanced, max 14ch): the signed-out welcome headline only.
- **Headline** (700, 2.75rem; 2.25rem on phone, tracking -0.025em): the page title under the page icon.
- **Title** (600, 1rem, line-height 1.375, tracking -0.025em, clamped to two lines): card titles. Empty-state titles use 600 at 1.125rem.
- **Body** (400, 15px, line-height 1.625, Ink 2): bookmark summaries, sidebar nav items, search field. Inputs in the save bar use 16px so phones do not zoom.
- **Body Lead** (400, 1.125rem, line-height 1.625, max 46ch): the welcome paragraph.
- **Label** (400, 0.875rem): card metadata, property row, tag pills, results line, errors. Counts and dates use tabular numerals.
- **Group Label** (600, 0.75rem, tracking 0.025em, uppercase, Ink 3): the sidebar "Tags" group heading only.

### Named Rules
**The Weight-Not-Family Rule.** Hierarchy is built from Onest's weights (400, 500, 600, 700) and tracking. Do not add a second typeface.

## Layout

A two-pane workspace. On desktop (from 768px) the sidebar is a fixed-width column (`sidebar-width`, 264px), sticky and full viewport height, with a right hairline. The main pane is the dot-grid board; its content is centred at max 64rem with 40px side padding and 48px top padding, stacked with 24px gaps: page header (icon, title, properties, 12px apart), save bar, search, results.

Bookmark cards sit in a board grid: one column below 1024px, two columns from 1024px, 12px gaps, top-aligned so cards keep their natural height. Card internals stack at 12px; card padding is 20px.

On phones the sidebar becomes a top bar (brand plus sign-out) above a horizontally scrolling strip of filter items; page padding drops to 16px and top padding to 32px. The signed-out welcome is a single column on phones with an inline example board, and a two-column split from 1024px with the example board filling the right half.

**The Board Ground Rule.** The main pane always sits on the dot grid (1.2px dots every 22px on Warm Paper). The sidebar never does.

## Elevation & Depth

A soft, layered system on a flat board. Cards and the save bar float slightly above the dot grid with a two-layer warm shadow tinted from Warm Ink; interaction raises them to a deeper lift. The sidebar, search field and nav items are flat and separated by hairlines and tone. In dark mode the same two levels use black at higher opacity.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 1px 2px rgb(38 36 32 / 0.06), 0 4px 12px rgb(38 36 32 / 0.05)`): resting cards, sticky notes, the save bar, the sign-in button.
- **Lift** (`box-shadow: 0 2px 4px rgb(38 36 32 / 0.06), 0 12px 28px rgb(38 36 32 / 0.1)`): card hover, save bar while focused, sign-in hover, the illustrative cards on the welcome board.

### Named Rules
**The Two-Levels Rule.** There are exactly two shadows, Card and Lift. Lift is a response to hover or focus (or an illustration lying on the board), never a resting state for working UI.

## Shapes

Rounded, soft-cornered forms that read as paper on a board. Large containers (cards, the save bar, the large page icon) use 16px corners; interactive controls one step inside them (Save, search field, secondary buttons, error notes) use 12px; small controls (icon buttons, nav items, the host tile, the small brand tile) use 8px; tag pills use 6px. Dots, avatars and the spinner are full circles. Borders are 1px hairlines; the empty state uses a dashed hairline. Pending sticky notes drop the border entirely.

**The Nested Corners Rule.** A control sitting inside a container takes the next radius down (16 to 12 to 8 to 6), so the Save button inside the save bar reads as nested, not pasted on.

## Components

### Buttons
Confident, compact and rounded; every one shows a spinner and a verb in progress while pending.
- **Shape:** 12px corners on text buttons, 8px on 32px icon buttons.
- **Primary:** Action Yellow with Accent Ink, 600 weight, 40px tall, 16px side padding, a bold plus icon before "Save". Hover deepens the yellow. Pending shows a spinner and "Saving…" at 70% opacity.
- **Secondary:** Card White with a hairline border, 500 weight, 15px, 40px tall; hover fills Hover Stone.
- **Ink (sign in):** Warm Ink fill with Warm Paper text, 48px tall, GitHub mark; Card shadow at rest, on hover it rises 1px with the Lift shadow.
- **Icon:** transparent, Ink 3, 32px square; hover fills Hover Stone and darkens to Warm Ink. Delete instead hovers to Danger on Danger Wash, and its card fades to 50% while deleting.
- **Focus:** the global 2px Focus Blue outline, offset 2px.

### Chips
- **Tag pill:** 6px corners, the tone's pale background and dark ink, a 6px dot of the tone's saturated colour before the name, 14px text. The name links to the tag filter; a small X removes it (60% opacity, full on hover).
- **Add tag:** an inline "+ Add tag" field after the pills. On pointer devices it is collapsed to zero width and opens on card hover or keyboard focus, so it stays reachable by Tab.
- **Arrival:** on a freshly analyzed card each pill pops in (scale 0.85 to 1, 0.5s, 70ms stagger after a 400ms delay).

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** Card White; pending bookmarks are Sticky Note with Sticky Ink and no border.
- **Shadow Strategy:** Card at rest, Lift on hover (see Elevation & Depth).
- **Border:** 1px Hairline.
- **Internal Padding:** 20px, 12px between rows.
- **Anatomy:** a 36px host tile (tag tone of the hostname, initial letter, 8px corners), a two-line-clamped title, a metadata row (URL · date) in Ink 3, icon buttons top right, then the summary and tags. Failed bookmarks show a Danger Wash note with an alert icon in place of the summary.
- **Settle:** when a bookmark turns ready, the card animates from Sticky Note to Card White and from 2px up to rest over 1.4s on `cubic-bezier(0.16, 1, 0.3, 1)`. All motion is removed under reduced-motion.

### Inputs / Fields
- **Save bar:** the most prominent field. A 16px-radius Card White bar with a hairline border, Card shadow and 8px padding, holding a link icon, a borderless 16px input and the primary Save button. On focus-within it rises to Lift instead of drawing a ring around the input.
- **Search:** 12px radius, Card White, hairline border, 40px tall, search icon, 15px text, capped at 36rem with the secondary Search button beside it. Focus-within darkens the border to Ink 3.
- **Error:** a Danger line under the field with an alert icon, announced as an alert.

### Navigation
- **Sidebar nav (Filter by tag):** 15px Ink 2 items, 8px corners, 6px by 10px padding, an icon or tone dot on the left and a tabular count in Ink 3 on the right. Hover fills Hover Stone. The current item is Action Yellow with Accent Ink, 500 weight, and its count and icon switch to Accent Ink.
- **Group label:** "Tags" in the Group Label style above the tag list, desktop only.
- **Account footer:** a 32px yellow initial avatar, name and email, and an icon sign-out button, pinned to the bottom of the sidebar.
- **Phone:** the same items in a horizontally scrolling row under the top bar.

### Page Header (signature)
The Notion-style page head: a 56px Action Yellow tile with a filled bookmark icon (16px corners), the Headline title, and a property row of icon-led facts (bookmark count, last saved date) in 14px Ink 2 with the value in Warm Ink.

### Sticky Note (signature)
The waiting state: a Sticky Note card with a sparkles icon, "Claude is reading this page" in 600 weight, three 4px typing dots that bob in sequence (1.2s, 150ms stagger), and two rounded placeholder lines in the ink colour at low opacity.

## Do's and Don'ts

### Do:
- **Do** put the main pane on the dot grid and keep the sidebar flat Sidebar Stone.
- **Do** use Action Yellow with Accent Ink for the single primary action and for "where you are" in navigation.
- **Do** colour every tag through `toneFor(name)` so a tag has the same tone in the sidebar, on cards and in the results line.
- **Do** show waiting as a Sticky Note with typing dots, and arrival as the settle-and-pop sequence.
- **Do** give every action a pending state: spinner plus a present-tense verb ("Saving…", "Deleting…").
- **Do** draw icons with lucide line icons at 16px (20px in the save bar), and the page icon as the yellow bookmark tile.
- **Do** define every colour for both light and dark in `app/globals.css`.

### Don't:
- **Don't** introduce a second action colour or put white text on yellow.
- **Don't** use tag tones for buttons, status or chrome.
- **Don't** use blue for anything but focus.
- **Don't** tilt working cards; the slight rotations belong only to the illustrative example board on the welcome screen.
- **Don't** use emoji or text glyphs as icons.
- **Don't** add hard offset shadows or a third shadow level.
- **Don't** fall back to a plain centred column of grey cards.
