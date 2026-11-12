// Example cards for the quiz hook. Kept content-free so the client bundle stays small;
// tests/character/content.test.ts checks they still match the real entries.
export type ExampleCard = { slug: string; char: string; meaning: string; parts: [string, string] };

/** Order matters: [left, center, right] in the fan. */
export const EXAMPLE_CARDS: ExampleCard[] = [
  { slug: "wisdom", char: "慧", meaning: "wisdom", parts: ["彗", "心"] },
  { slug: "friend", char: "朋", meaning: "friend", parts: ["月", "月"] },
  { slug: "immortal", char: "仙", meaning: "immortal", parts: ["人", "山"] },
];

/** The public example reading (no payment). Tests check these answers really produce this result. */
export const EXAMPLE_READING = {
  id: "wisdom-rabbit-fire",
  answers: [3, 1, 3, 0],
  birth: { y: 1987, m: 6, d: 15 },
} as const;

/** All 24 soul characters, for the quiz's "shuffle" animation (checked against content in tests). */
export const SHUFFLE_CHARS = "朋信伴忠仁恤和宝忍愈活勇慧思感悟休住香梦喜萌愿仙";
