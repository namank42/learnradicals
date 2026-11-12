import { describe, expect, it } from "vitest";
import { getZodiac } from "@/lib/character/zodiac";

describe("getZodiac", () => {
  it("uses the previous lunar year before Lunar New Year", () => {
    expect(getZodiac(1987, 1, 28)).toEqual({ animal: "tiger", element: "fire", lunarYear: 1986 });
  });

  it("switches on Lunar New Year day", () => {
    expect(getZodiac(1987, 1, 29)).toEqual({ animal: "rabbit", element: "fire", lunarYear: 1987 });
  });

  it("handles the 2000 boundary", () => {
    expect(getZodiac(2000, 2, 4)).toEqual({ animal: "rabbit", element: "earth", lunarYear: 1999 });
    expect(getZodiac(2000, 2, 5)).toEqual({ animal: "dragon", element: "metal", lunarYear: 2000 });
  });

  it("handles mid-year and range-edge dates", () => {
    expect(getZodiac(1990, 6, 15)).toEqual({ animal: "horse", element: "metal", lunarYear: 1990 });
    expect(getZodiac(2015, 12, 31)).toEqual({ animal: "goat", element: "wood", lunarYear: 2015 });
  });

  it("rejects years outside the supported range", () => {
    expect(() => getZodiac(1924, 12, 31)).toThrow(RangeError);
    expect(() => getZodiac(2016, 1, 1)).toThrow(RangeError);
  });

  it("rejects impossible dates", () => {
    expect(() => getZodiac(2001, 2, 30)).toThrow(RangeError);
    expect(() => getZodiac(2001, 13, 1)).toThrow(RangeError);
  });
});
