import { describe, expect, it } from "vitest";
import { CHARACTERS } from "@/lib/character/content/characters";
import { ANIMAL_PROFILES } from "@/lib/character/content/animals";
import { ELEMENT_PROFILES } from "@/lib/character/content/elements";
import { QUESTIONS } from "@/lib/character/content/questions";
import { ANIMALS, ELEMENTS } from "@/lib/character/types";

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const BANNED = /etymolog|originally meant|historically/i;
export const PREORDER_LINE = "Your full 2027 Goat-year kit is coming — pre-order it below.";

const allStrings = (o: unknown): string[] =>
  typeof o === "string" ? [o] : Array.isArray(o) ? o.flatMap(allStrings)
  : o && typeof o === "object" ? Object.values(o).flatMap(allStrings) : [];

describe("characters", () => {
  const slugs = CHARACTERS.map((c) => c.slug);

  it("has 24 unique, url-safe slugs", () => {
    expect(CHARACTERS).toHaveLength(24);
    expect(new Set(slugs).size).toBe(24);
    for (const s of slugs) expect(s).toMatch(/^[a-z]+$/);
  });

  it.each(CHARACTERS.map((c) => [c.slug, c] as const))("%s is complete", (_slug, c) => {
    expect([...c.char]).toHaveLength(1);
    if (c.traditional) {
      expect([...c.traditional]).toHaveLength(1);
      expect(c.traditional).not.toBe(c.char);
    }
    expect(c.pinyin.trim()).not.toBe("");
    expect(words(c.meaning)).toBeLessThanOrEqual(4);
    expect(c.parts.length).toBeGreaterThanOrEqual(2);
    expect(c.parts.length).toBeLessThanOrEqual(3);
    for (const p of c.parts) {
      expect(p.char.trim()).not.toBe("");
      expect(p.gloss.trim()).not.toBe("");
    }
    expect(c.decode.length).toBeLessThanOrEqual(90);
    expect(words(c.about)).toBeGreaterThanOrEqual(150);
    expect(words(c.about)).toBeLessThanOrEqual(250);
    expect(c.words).toHaveLength(3);
    for (const w of c.words) {
      expect(w.hanzi).toContain(c.char);
      expect(w.pinyin.trim()).not.toBe("");
      expect(w.en.trim()).not.toBe("");
    }
    expect(c.hardDays.length).toBeLessThanOrEqual(140);
    expect(slugs).toContain(c.pairsWith);
    expect(c.pairsWith).not.toBe(c.slug);
  });
});

describe("animals and elements", () => {
  it("covers all 12 animals with in-range copy", () => {
    expect(ANIMAL_PROFILES.map((a) => a.animal).sort()).toEqual([...ANIMALS].sort());
    for (const a of ANIMAL_PROFILES) {
      expect(a.zh.trim()).not.toBe("");
      expect(a.badge.length).toBeLessThanOrEqual(60);
      expect(words(a.profile)).toBeGreaterThanOrEqual(80);
      expect(words(a.profile)).toBeLessThanOrEqual(120);
      expect(words(a.goatYear)).toBeGreaterThanOrEqual(60);
      expect(words(a.goatYear)).toBeLessThanOrEqual(100);
      expect(a.goatYear.trim().endsWith(PREORDER_LINE)).toBe(true);
    }
  });

  it("covers all 5 elements with in-range copy", () => {
    expect(ELEMENT_PROFILES.map((e) => e.element).sort()).toEqual([...ELEMENTS].sort());
    for (const e of ELEMENT_PROFILES) {
      expect(e.zh.trim()).not.toBe("");
      expect(e.badge.length).toBeLessThanOrEqual(60);
      expect(words(e.profile)).toBeGreaterThanOrEqual(40);
      expect(words(e.profile)).toBeLessThanOrEqual(80);
    }
  });
});

describe("questions", () => {
  const slugs = new Set(CHARACTERS.map((c) => c.slug));

  it("has 4 questions with 4 answers and valid weight keys", () => {
    expect(QUESTIONS).toHaveLength(4);
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(4);
    for (const q of QUESTIONS) {
      expect(q.answers).toHaveLength(4);
      for (const a of q.answers) {
        const keys = Object.keys(a.weights);
        expect(keys.length).toBeGreaterThanOrEqual(3);
        expect(keys.length).toBeLessThanOrEqual(4);
        for (const k of keys) expect(slugs.has(k)).toBe(true);
      }
    }
  });

  it("weights every character in at least 2 answers", () => {
    const counts = new Map<string, number>();
    for (const q of QUESTIONS) for (const a of q.answers)
      for (const k of Object.keys(a.weights)) counts.set(k, (counts.get(k) ?? 0) + 1);
    for (const s of slugs) expect(counts.get(s) ?? 0, s).toBeGreaterThanOrEqual(2);
  });
});

describe("copy rules", () => {
  it("never claims etymology or history", () => {
    const text = allStrings([CHARACTERS, ANIMAL_PROFILES, ELEMENT_PROFILES, QUESTIONS]);
    for (const s of text) expect(s, s.slice(0, 60)).not.toMatch(BANNED);
  });
});

import { EXAMPLE_RESULT } from "@/lib/character/example";

describe("hook example", () => {
  it("matches the real content entry", () => {
    const c = CHARACTERS.find((x) => x.slug === EXAMPLE_RESULT.slug)!;
    expect({ char: c.char, pinyin: c.pinyin, meaning: c.meaning, decode: c.decode }).toEqual({
      char: EXAMPLE_RESULT.char,
      pinyin: EXAMPLE_RESULT.pinyin,
      meaning: EXAMPLE_RESULT.meaning,
      decode: EXAMPLE_RESULT.decode,
    });
  });
});
