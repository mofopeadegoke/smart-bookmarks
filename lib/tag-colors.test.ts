import { describe, expect, it } from "vitest";
import { toneFor } from "@/lib/tag-colors";

describe("toneFor", () => {
  it("always gives the same tag the same tone", () => {
    expect(toneFor("react")).toBe(toneFor("react"));
    expect(toneFor("日本語")).toBe(toneFor("日本語"));
  });

  it("spreads common tags across several tones", () => {
    const tags = ["react", "postgres", "databases", "frontend", "ai", "css", "testing", "nextjs", "go", "rust"];
    expect(new Set(tags.map(toneFor)).size).toBeGreaterThanOrEqual(5);
  });
});
