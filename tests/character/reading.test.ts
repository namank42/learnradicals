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

import { buildReflection, parseAnswers } from "@/lib/character/reflection";
import { QUESTIONS } from "@/lib/character/content/questions";

describe("buildReflection", () => {
  it("quotes all four answers and names the character", () => {
    const r = buildReflection([1, 1, 0, 1], "慧")!;
    expect(r).toContain("stay in with a book and a blanket");
    expect(r).toContain("honest advice, even when it stings");
    expect(r).toContain("“Slow is still moving.”");
    expect(r).toContain("more quiet mornings to think");
    expect(r.endsWith("That's 慧.")).toBe(true);
  });

  it("speaks about someone else on shared readings", () => {
    const r = buildReflection([1, 1, 0, 1], "慧", "they")!;
    expect(r.startsWith("They said they'd stay in")).toBe(true);
    expect(r).toContain("people come to them for");
    expect(r).toContain("on their lock screen");
    expect(r).toContain("they secretly want");
  });

  it("returns null without valid answers", () => {
    expect(buildReflection(null, "慧")).toBeNull();
    expect(buildReflection([1, 1], "慧")).toBeNull();
    expect(buildReflection([1, 1, 9, 1], "慧")).toBeNull();
  });

  it("has a reflect phrase for every answer", () => {
    for (const q of QUESTIONS) for (const a of q.answers) expect(a.reflect.trim()).not.toBe("");
  });

  it("keeps reflect phrases pronoun-free so shared readings read as 'they'", () => {
    // The lock-screen answer is quoted verbatim, so it may say "you".
    for (const q of QUESTIONS.filter((x) => x.id !== "lockscreen"))
      for (const a of q.answers) expect(a.reflect, a.reflect).not.toMatch(/\b(you|your|you've|you're)\b/i);
  });

  it("parses answer strings", () => {
    expect(parseAnswers("3102")).toEqual([3, 1, 0, 2]);
    expect(parseAnswers("31")).toBeNull();
    expect(parseAnswers("3104")).toBeNull();
    expect(parseAnswers(null)).toBeNull();
  });
});

import { EXAMPLE_READING } from "@/lib/character/example";
import { scoreCharacter } from "@/lib/character/scoring";
import { getZodiac } from "@/lib/character/zodiac";
import { encodeResultId } from "@/lib/character/encode";

describe("example reading", () => {
  it("is what its answers and birthday really produce", () => {
    const { y, m, d } = EXAMPLE_READING.birth;
    const z = getZodiac(y, m, d);
    const slug = scoreCharacter([...EXAMPLE_READING.answers], EXAMPLE_READING.birth);
    expect(encodeResultId(slug, z.animal, z.element)).toBe(EXAMPLE_READING.id);
  });
});
