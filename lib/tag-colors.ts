const TONES = ["grey", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"] as const;

export type Tone = (typeof TONES)[number];

// Hashing the name (FNV-1a) gives every tag the same colour on every page and every visit, with nothing stored.
export function toneFor(name: string): Tone {
  let hash = 0x811c9dc5;
  for (const char of name) {
    hash ^= char.codePointAt(0)!;
    hash = Math.imul(hash, 0x01000193);
  }
  return TONES[(hash >>> 0) % TONES.length];
}
