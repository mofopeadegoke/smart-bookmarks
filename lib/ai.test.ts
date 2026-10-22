import { describe, expect, it } from "vitest";
import { analyze, parseAnalysis } from "@/lib/ai";

const reply = (value: unknown) => JSON.stringify(value);

describe("parseAnalysis", () => {
  it("accepts a well-formed reply", () => {
    expect(parseAnalysis(reply({ summary: "A page about React.", tags: ["react", "frontend"] }))).toEqual({
      summary: "A page about React.",
      tags: ["react", "frontend"],
    });
  });

  it("cleans messy tags", () => {
    const result = parseAnalysis(reply({ summary: "x", tags: ["React JS", "  Web Dev  "] }));
    expect(result.tags).toEqual(["react-js", "web-dev"]);
  });

  it("removes duplicates, including ones that only match after cleaning", () => {
    const result = parseAnalysis(reply({ summary: "x", tags: ["react", "React", " REACT ", "css"] }));
    expect(result.tags).toEqual(["react", "css"]);
  });

  it("drops tags that clean down to nothing", () => {
    const result = parseAnalysis(reply({ summary: "x", tags: ["!!!", "", "css"] }));
    expect(result.tags).toEqual(["css"]);
  });

  it("keeps at most 5 tags", () => {
    const result = parseAnalysis(reply({ summary: "x", tags: ["a", "b", "c", "d", "e", "f", "g"] }));
    expect(result.tags).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("trims the summary", () => {
    expect(parseAnalysis(reply({ summary: "  Hello.  ", tags: [] })).summary).toBe("Hello.");
  });

  it.each([
    ["missing summary", { tags: ["a"] }],
    ["missing tags", { summary: "x" }],
    ["empty summary", { summary: "   ", tags: [] }],
    ["summary not a string", { summary: 42, tags: [] }],
    ["tags not an array", { summary: "x", tags: "react" }],
    ["tag not a string", { summary: "x", tags: [1, 2] }],
    ["null", null],
  ])("rejects a reply with %s", (_label, value) => {
    expect(() => parseAnalysis(reply(value))).toThrow();
  });

  it("rejects text that isn't JSON", () => {
    expect(() => parseAnalysis("Sure! Here is your summary:")).toThrow();
  });
});

describe("analyze with AI_MODE=fake", () => {
  it("never calls Claude and returns a fixed answer", async () => {
    const result = await analyze({ title: null, text: "Hello world", existingTags: [] });
    expect(result).toEqual({ summary: "Hello world", tags: ["test"] });
  });
});
