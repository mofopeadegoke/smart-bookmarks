// Turns what the user typed into a clean link, or returns null if it isn't one.
export function normalizeUrl(input: string): string | null {
  let text = input.trim();
  if (!text) return null;

  // Let people type "example.com" without "https://"
  if (!/^https?:\/\//i.test(text)) text = `https://${text}`;

  try {
    const url = new URL(text);
    // Only allow normal web links (no "file://", "javascript:", etc.)
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    // A real website name has a dot in it, like "example.com"
    if (!url.hostname.includes(".")) return null;
    url.hash = ""; // "page#section" and "page" count as the same link
    return url.toString();
  } catch {
    return null; // not a link at all
  }
}
