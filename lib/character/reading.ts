export type AboutSections = { who: string[]; shadow: string | null; need: string };

const SHADOW = "The shadow side: ";
const NEED = "What you need";

/**
 * Splits a character's `about` copy into the reading's three sections.
 * Every entry has a "What you need…" sentence; most also have "The shadow side: …".
 */
export function splitAbout(about: string): AboutSections {
  const text = about.replace(/\s+/g, " ").trim();
  const needAt = text.indexOf(NEED);
  const head = needAt >= 0 ? text.slice(0, needAt).trim() : text;
  const need = needAt >= 0 ? text.slice(needAt).trim() : "";

  const shadowAt = head.indexOf(SHADOW);
  const whoText = shadowAt >= 0 ? head.slice(0, shadowAt).trim() : head;
  const shadowRaw = shadowAt >= 0 ? head.slice(shadowAt + SHADOW.length).trim() : null;
  const shadow = shadowRaw ? shadowRaw[0].toUpperCase() + shadowRaw.slice(1) : null;

  const sentences = whoText.split(/(?<=[.!?])\s+/);
  const who =
    sentences.length > 8
      ? [sentences.slice(0, Math.ceil(sentences.length / 2)).join(" "), sentences.slice(Math.ceil(sentences.length / 2)).join(" ")]
      : [whoText];

  return { who, shadow, need };
}
