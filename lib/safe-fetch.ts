import { lookup } from "node:dns/promises";
import ipaddr from "ipaddr.js";

const TIMEOUT_MS = 8_000;
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 5;

export async function assertPublicUrl(raw: string | URL): Promise<URL> {
  const url = new URL(raw);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https links are allowed");
  }

  let addresses;
  try {
    addresses = await lookup(url.hostname, { all: true });
  } catch {
    throw new Error("This website doesn't exist");
  }

  for (const { address } of addresses) {
    if (ipaddr.process(address).range() !== "unicast") {
      throw new Error("This address is not allowed");
    }
  }

  return url;
}

export async function fetchPage(
  rawUrl: string,
): Promise<{ html: string; finalUrl: string }> {
  let url = await assertPublicUrl(rawUrl);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        "user-agent": "SmartBookmarksBot/1.0",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) throw new Error("Broken redirect");
      url = await assertPublicUrl(new URL(location, url));
      continue;
    }

    if (!res.ok) throw new Error(`The page returned an error (${res.status})`);

    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("text/html") && !type.includes("application/xhtml")) {
      throw new Error(
        "This link isn't a web page (it might be a PDF or image)",
      );
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("The page was empty");

    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > MAX_BYTES) {
        await reader.cancel();
        throw new Error("The page is too large");
      }
      chunks.push(value);
    }

    const html = new TextDecoder().decode(Buffer.concat(chunks));
    return { html, finalUrl: url.toString() };
  }

  throw new Error("Too many redirects");
}
