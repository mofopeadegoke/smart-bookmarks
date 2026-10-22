import { parseHTML } from "linkedom";
import { Readability } from "@mozilla/readability";

export function extractContent(html: string): {
  title: string | null;
  text: string;
} {
  const { document } = parseHTML(html);

  const pageTitle =
    document.querySelector("title")?.textContent?.trim() || null;

  const article = new Readability(document as unknown as Document).parse();

  const title = article?.title?.trim() || pageTitle;

  const text = (article?.textContent ?? document.body?.textContent ?? "")
    .replace(/\s+/g, " ")
    .trim();

  return { title, text };
}
