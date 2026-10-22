import { describe, expect, it } from "vitest";
import { bookmarksHref, normalizeUrl } from "@/lib/urls";

describe("normalizeUrl", () => {
  it("adds https:// when the scheme is missing", () => {
    expect(normalizeUrl("react.dev/learn")).toBe("https://react.dev/learn");
  });

  it("keeps an explicit http:// link", () => {
    expect(normalizeUrl("http://example.com/")).toBe("http://example.com/");
  });

  it("trims surrounding spaces", () => {
    expect(normalizeUrl("  example.com  ")).toBe("https://example.com/");
  });

  it("strips the #hash so the same page isn't saved twice", () => {
    expect(normalizeUrl("https://example.com/page#section")).toBe("https://example.com/page");
  });

  it.each(["", "   ", "hello", "localhost", "not a url at all", "https://"])(
    "rejects %j",
    (input) => {
      expect(normalizeUrl(input)).toBeNull();
    },
  );

  it.each(["ftp://example.com/file", "javascript:alert(1)", "file:///etc/passwd"])(
    "never returns a non-http link for %j",
    (input) => {
      const result = normalizeUrl(input);
      if (result !== null) expect(new URL(result).protocol).toBe("https:");
    },
  );
});

describe("bookmarksHref", () => {
  it("returns / with no filters", () => {
    expect(bookmarksHref({})).toBe("/");
  });

  it("encodes search and tag", () => {
    expect(bookmarksHref({ q: "server components", tag: "c++" })).toBe(
      "/?q=server+components&tag=c%2B%2B",
    );
  });
});
