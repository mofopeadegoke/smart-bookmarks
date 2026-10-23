import { expect, test, type Page } from "@playwright/test";
import { connect, resetBookmarks, seedBookmarks } from "./db";

const { pool, db } = connect();

test.beforeEach(async () => {
  await resetBookmarks(db);
});

test.afterAll(async () => {
  await pool.end();
});

const REACT = {
  url: "https://react.dev/learn",
  title: "Quick Start – React",
  summary: "An introduction to components, props and state.",
  tags: ["react", "frontend"],
};

const POSTGRES = {
  url: "https://www.postgresql.org/docs/current/indexes.html",
  title: "PostgreSQL: Indexes",
  summary: "How B-tree and GIN indexes speed up queries.",
  tags: ["postgres", "databases"],
};

function card(page: Page, url: string) {
  return page.locator("main li").filter({ hasText: url });
}

test("saving a link shows it analyzed with a summary and tags", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Link to save").fill("example.com");
  await page.getByRole("button", { name: "Save" }).click();

  const saved = card(page, "https://example.com/");
  await expect(saved).toBeVisible();
  // AI_MODE=fake answers with the tag "test"; the title comes from the real page.
  await expect(saved.getByRole("link", { name: "test", exact: true })).toBeVisible({ timeout: 20_000 });
  await expect(saved.getByRole("link", { name: "Example Domain" })).toBeVisible();
});

test("filtering by tag shows only matching bookmarks", async ({ page }) => {
  await seedBookmarks(db, [REACT, POSTGRES]);
  await page.goto("/");

  await page
    .getByRole("navigation", { name: "Filter by tag" })
    .getByRole("link", { name: /^postgres/ })
    .click();

  await expect(page).toHaveURL(/\?tag=postgres$/);
  await expect(card(page, POSTGRES.url)).toBeVisible();
  await expect(card(page, REACT.url)).toHaveCount(0);
  await expect(page.getByText("1 result")).toBeVisible();
  // Regression: the search bar used to duplicate on every filter change.
  await expect(page.getByRole("search")).toHaveCount(1);
});

test("searching titles and summaries finds the right bookmark", async ({ page }) => {
  await seedBookmarks(db, [REACT, POSTGRES]);
  await page.goto("/");

  await page.getByLabel("Search bookmarks").fill("indexes");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL(/\?q=indexes$/);
  await expect(card(page, POSTGRES.url)).toBeVisible();
  await expect(card(page, REACT.url)).toHaveCount(0);

  await page.getByRole("link", { name: "Clear" }).click();
  await expect(card(page, REACT.url)).toBeVisible();
  await expect(page.getByRole("search")).toHaveCount(1);
});

const CAFE = {
  url: "https://example.org/cafe",
  title: "Le meilleur café de Paris",
  summary: "Où boire un bon espresso près du Louvre.",
  tags: ["coffee"],
};

const RUSSIAN = {
  url: "https://example.org/ru",
  title: "Введение в базы данных",
  summary: "Как работают индексы и запросы.",
  tags: ["базы-данных"],
};

const JAPANESE = {
  url: "https://example.org/ja",
  title: "日本語の記事です",
  summary: "東京のおすすめラーメン店を紹介します。",
  tags: ["ramen"],
};

for (const [query, expected] of [
  ["cafe", CAFE],
  ["CAFÉ", CAFE],
  ["базы", RUSSIAN],
  ["日本語", JAPANESE],
  ["ラーメン", JAPANESE],
] as const) {
  test(`searching "${query}" finds "${expected.title}"`, async ({ page }) => {
    await seedBookmarks(db, [CAFE, RUSSIAN, JAPANESE]);
    await page.goto(`/?q=${encodeURIComponent(query)}`);

    await expect(card(page, expected.url)).toBeVisible();
    await expect(page.getByText("1 result")).toBeVisible();
  });
}

test("search treats % literally", async ({ page }) => {
  await seedBookmarks(db, [CAFE, RUSSIAN, JAPANESE]);
  await page.goto(`/?q=${encodeURIComponent("%")}`);

  await expect(page.getByText("0 results")).toBeVisible();
});

test("deleting a bookmark removes it for good", async ({ page }) => {
  await seedBookmarks(db, [REACT]);
  await page.goto("/");

  await card(page, REACT.url).getByRole("button", { name: "Delete" }).click();

  await expect(card(page, REACT.url)).toHaveCount(0);
  await page.reload();
  await expect(card(page, REACT.url)).toHaveCount(0);
  await expect(page.getByText("No bookmarks yet")).toBeVisible();
});

test.describe("signed out", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("shows the sign-in screen instead of bookmarks", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Sign in with GitHub" })).toBeVisible();
    await expect(page.getByLabel("Link to save")).toHaveCount(0);
  });
});
