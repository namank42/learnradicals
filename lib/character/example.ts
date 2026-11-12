// Example cards for the quiz hook. Kept content-free so the client bundle stays small;
// tests/character/content.test.ts checks they still match the real entries.
export type ExampleCard = { slug: string; char: string; meaning: string; parts: [string, string] };

/** Order matters: [left, center, right] in the fan. */
export const EXAMPLE_CARDS: ExampleCard[] = [
  { slug: "wisdom", char: "慧", meaning: "wisdom", parts: ["彗", "心"] },
  { slug: "friend", char: "朋", meaning: "friend", parts: ["月", "月"] },
  { slug: "immortal", char: "仙", meaning: "immortal", parts: ["人", "山"] },
];
