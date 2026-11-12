import { describe, expect, it } from "vitest";
import { scoreCharacter } from "@/lib/character/scoring";
import { CHARACTERS } from "@/lib/character/content/characters";

const BIRTHS = [
  { y: 1990, m: 6, d: 15 },
  { y: 1987, m: 1, d: 28 },
  { y: 2001, m: 11, d: 3 },
];

const allCombos = (): number[][] => {
  const out: number[][] = [];
  for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++)
    for (let c = 0; c < 4; c++) for (let d = 0; d < 4; d++) out.push([a, b, c, d]);
  return out;
};

describe("scoreCharacter", () => {
  it("is deterministic", () => {
    const birth = BIRTHS[0];
    expect(scoreCharacter([0, 1, 2, 3], birth)).toBe(scoreCharacter([0, 1, 2, 3], birth));
  });

  it("returns a known slug", () => {
    const slugs = new Set(CHARACTERS.map((c) => c.slug));
    expect(slugs.has(scoreCharacter([1, 1, 1, 1], BIRTHS[1]))).toBe(true);
  });

  it("rejects malformed answers", () => {
    expect(() => scoreCharacter([0, 1, 2], BIRTHS[0])).toThrow();
    expect(() => scoreCharacter([0, 1, 2, 4], BIRTHS[0])).toThrow();
    expect(() => scoreCharacter([0, 1, 2, -1], BIRTHS[0])).toThrow();
  });

  it("reaches every character and none dominates", () => {
    const counts = new Map<string, number>();
    let total = 0;
    for (const birth of BIRTHS)
      for (const combo of allCombos()) {
        const s = scoreCharacter(combo, birth);
        counts.set(s, (counts.get(s) ?? 0) + 1);
        total++;
      }
    for (const c of CHARACTERS) expect(counts.get(c.slug) ?? 0, c.slug).toBeGreaterThan(0);
    for (const [slug, n] of counts) expect(n / total, slug).toBeLessThanOrEqual(0.12);
  });
});
