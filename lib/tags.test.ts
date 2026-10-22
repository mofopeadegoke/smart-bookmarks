import { describe, expect, it } from "vitest";
import { cleanTag } from "@/lib/tags";

describe("cleanTag", () => {
  it.each([
    ["React JS", "react-js"],
    ["  TypeScript  ", "typescript"],
    ["machine   learning", "machine-learning"],
    ["C++", "c++"],
    ["C#", "c#"],
    ["node.js", "node.js"],
    ["Rock & Roll!", "rock-roll"],
    ["AI / ML", "ai-ml"],
    ["- react -", "react"],
    ["café", "café"],
    ["Naïve Bayes", "naïve-bayes"],
    ["Ünïcödé", "ünïcödé"],
    ["日本語", "日本語"],
    ["Machine Learning 機械学習", "machine-learning-機械学習"],
    ["Русский язык", "русский-язык"],
    ["العربية", "العربية"],
    ["Web 3", "web-3"],
  ])("cleans %j to %j", (input, expected) => {
    expect(cleanTag(input)).toBe(expected);
  });

  it("returns an empty string when nothing usable is left", () => {
    expect(cleanTag("!!!")).toBe("");
    expect(cleanTag("   ")).toBe("");
  });

  it("treats a composed and a decomposed accent as the same tag", () => {
    expect(cleanTag("cafe\u0301")).toBe(cleanTag("caf\u00e9"));
  });

  it("drops emoji and other symbols", () => {
    expect(cleanTag("🔥 hot takes 🔥")).toBe("hot-takes");
  });

  it("caps tags at 30 characters", () => {
    expect(cleanTag("a".repeat(50))).toHaveLength(30);
  });

  it("counts characters, not bytes, when capping", () => {
    const tag = cleanTag("𠜎".repeat(40));
    expect(Array.from(tag)).toHaveLength(30);
    expect(tag).toBe("𠜎".repeat(30));
  });
});
