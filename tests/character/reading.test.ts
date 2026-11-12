import { describe, expect, it } from "vitest";
import { splitAbout } from "@/lib/character/reading";
import { CHARACTERS } from "@/lib/character/content/characters";

describe("splitAbout", () => {
  it("splits into who / shadow / need on the markers", () => {
    const r = splitAbout(
      "You are kind. People love you. The shadow side: you forget yourself. It hurts. What you need is rest. Take it.",
    );
    expect(r.who).toEqual(["You are kind. People love you."]);
    expect(r.shadow).toBe("You forget yourself. It hurts.");
    expect(r.need).toBe("What you need is rest. Take it.");
  });

  it("handles a missing shadow marker", () => {
    const r = splitAbout("One. Two. Three. Four. What you need is calm.");
    expect(r.shadow).toBeNull();
    expect(r.need).toBe("What you need is calm.");
    expect(r.who.join(" ")).toBe("One. Two. Three. Four.");
  });

  it("breaks a long 'who' section into two paragraphs", () => {
    const who = Array.from({ length: 12 }, (_, i) => `Sentence ${i}.`).join(" ");
    expect(splitAbout(`${who} What you need is x.`).who).toHaveLength(2);
  });

  it.each(CHARACTERS.map((c) => [c.slug, c] as const))("%s loses no text", (_s, c) => {
    const r = splitAbout(c.about);
    const rebuilt = [...r.who, r.shadow ? `The shadow side: ${r.shadow[0].toLowerCase()}${r.shadow.slice(1)}` : "", r.need]
      .filter(Boolean)
      .join(" ");
    const norm = (s: string) => s.replace(/\s+/g, " ").trim();
    expect(norm(rebuilt)).toBe(norm(c.about));
    expect(r.need.startsWith("What you need")).toBe(true);
  });
});
