export const ANIMALS = [
  "rat", "ox", "tiger", "rabbit", "dragon", "snake",
  "horse", "goat", "monkey", "rooster", "dog", "pig",
] as const;
export type Animal = (typeof ANIMALS)[number];

export const ELEMENTS = ["wood", "fire", "earth", "metal", "water"] as const;
export type Element = (typeof ELEMENTS)[number];

/** One "soul character". Slugs are lowercase English words (e.g. "wisdom"), unique, no hyphens. */
export type CharacterEntry = {
  slug: string;
  char: string; // single simplified character
  traditional?: string; // only when it differs from `char`
  pinyin: string; // with tone marks
  meaning: string; // 1–4 words
  parts: { char: string; gloss: string }[]; // 2–3 parts, glosses as in the post
  decode: string; // free one-liner, ≤ 90 chars
  about: string; // paid, 150–250 words, second person
  words: { hanzi: string; pinyin: string; en: string }[]; // exactly 3, each contains `char`
  hardDays: string; // paid, ≤ 140 chars
  pairsWith: string; // slug of another entry
};

export type AnimalProfile = {
  animal: Animal;
  zh: string; // e.g. "兔"
  badge: string; // free, ≤ 60 chars
  profile: string; // paid, 80–120 words
  goatYear: string; // paid, 60–100 words, ends with the pre-order line
};

export type ElementProfile = {
  element: Element;
  zh: string; // e.g. "水"
  badge: string; // free, ≤ 60 chars
  profile: string; // paid, 40–80 words
};

/** reflect: how the answer is quoted back in the paid reading, e.g. "stay in with a book and a blanket". */
export type QuizAnswer = { label: string; reflect: string; weights: Record<string, number> };
export type QuizQuestion = { id: string; prompt: string; answers: QuizAnswer[] };
