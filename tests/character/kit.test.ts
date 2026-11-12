import { describe, expect, it } from "vitest";
import { bestMatches, KIT_MONTHS, KIT_PRINTS, LUCKY } from "@/lib/character/content/kit";
import { ANIMALS } from "@/lib/character/types";
import { kitCalendar } from "@/lib/character/kit-pages";

describe("kit content", () => {
  it("has 12 months in order with one character each", () => {
    expect(KIT_MONTHS.map((m) => m.month)).toEqual([
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ]);
    for (const m of KIT_MONTHS) {
      expect([...m.char]).toHaveLength(1);
      expect(m.pinyin && m.meaning && m.line && m.prompt).toBeTruthy();
    }
  });

  it("has 6 single-character prints and lucky data for every animal", () => {
    expect(KIT_PRINTS).toHaveLength(6);
    for (const a of ANIMALS) {
      expect(LUCKY[a].numbers.length).toBeGreaterThan(0);
      expect(LUCKY[a].colors.length).toBeGreaterThan(0);
    }
  });

  it("matches signs by the six harmonies and four trines", () => {
    expect(bestMatches("goat")).toEqual(["horse", "rabbit", "pig"]);
    expect(bestMatches("rat")).toEqual(["ox", "dragon", "monkey"]);
    for (const a of ANIMALS) {
      const m = bestMatches(a);
      expect(m).toHaveLength(3);
      expect(m).not.toContain(a);
      for (const b of m) expect(bestMatches(b)).toContain(a); // matches are mutual
    }
  });
});

describe("kitCalendar", () => {
  it("starts January 2027 on Friday (Sunday-first weeks)", () => {
    const cells = kitCalendar(0);
    expect(cells.slice(0, 6)).toEqual([null, null, null, null, null, 1]);
    expect(cells.filter(Boolean)).toHaveLength(31);
    expect(cells.length % 7).toBe(0);
  });

  it("knows 2027 is not a leap year", () => {
    expect(kitCalendar(1).filter(Boolean)).toHaveLength(28);
  });
});

import { KIT_PAGES } from "@/lib/character/kit-pages";

describe("kit pages", () => {
  it("are cover, your 2027, 12 months, 6 prints", () => {
    expect(KIT_PAGES).toHaveLength(20);
    expect(KIT_PAGES[0]).toEqual({ kind: "cover" });
    expect(KIT_PAGES[1]).toEqual({ kind: "year" });
    expect(KIT_PAGES.filter((p) => p.kind === "month")).toHaveLength(12);
    expect(KIT_PAGES.filter((p) => p.kind === "print")).toHaveLength(6);
  });
});
