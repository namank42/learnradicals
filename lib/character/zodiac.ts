import { ANIMALS, ELEMENTS, type Animal, type Element } from "./types";

export const MIN_BIRTH_YEAR = 1925;
export const MAX_BIRTH_YEAR = 2015;

export type Zodiac = { animal: Animal; element: Element; lunarYear: number };

// The ICU Chinese calendar gives the Gregorian year in which the current lunar
// year began ("relatedYear"), which handles January/February births without a
// hand-maintained table of Lunar New Year dates.
const chineseYear = new Intl.DateTimeFormat("en-u-ca-chinese", {
  year: "numeric",
  timeZone: "UTC",
});

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/** y, m (1–12), d. Throws RangeError for impossible dates or years outside MIN..MAX. */
export function getZodiac(y: number, m: number, d: number): Zodiac {
  if (!Number.isInteger(y) || y < MIN_BIRTH_YEAR || y > MAX_BIRTH_YEAR) {
    throw new RangeError(`Birth year must be ${MIN_BIRTH_YEAR}–${MAX_BIRTH_YEAR}`);
  }
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d
  ) {
    throw new RangeError("Invalid date");
  }

  const related = chineseYear
    .formatToParts(date)
    // "relatedYear" is emitted for non-Gregorian calendars but missing from TS lib types.
    .find((p) => (p.type as string) === "relatedYear")?.value;
  const lunarYear = Number(related);
  if (!Number.isInteger(lunarYear)) {
    throw new RangeError("Could not resolve lunar year");
  }

  return {
    animal: ANIMALS[mod(lunarYear - 4, 12)],
    element: ELEMENTS[Math.floor(mod(lunarYear - 4, 10) / 2)],
    lunarYear,
  };
}
