export function normalizeUrl(input: string): string | null {
  let text = input.trim();
  if (!text) return null;

  // Let people type "example.com" without "https://"
  if (!/^https?:\/\//i.test(text)) text = `https://${text}`;

  try {
    const url = new URL(text);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    // Rejects bare hostnames like `localhost`.
    if (!url.hostname.includes(".")) return null;
    // So `page#a` and `page` dedupe as one bookmark.
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

export function bookmarksHref({ q, tag }: { q?: string; tag?: string }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (tag) params.set("tag", tag);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}
