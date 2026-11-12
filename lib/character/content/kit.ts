import type { Animal } from "../types";

/** One page per month of 2027 in the Goat-year planner. */
export type KitMonth = {
  month: string;
  zh: string;
  char: string;
  pinyin: string;
  meaning: string;
  line: string; // one short line for the month
  prompt: string; // reflection prompt, completed by the reader
};

export const KIT_MONTHS: KitMonth[] = [
  { month: "January", zh: "一月", char: "新", pinyin: "xīn", meaning: "new", line: "Begin again, on purpose.", prompt: "This month, I want to begin..." },
  { month: "February", zh: "二月", char: "春", pinyin: "chūn", meaning: "spring", line: "The new year arrives in the middle of winter.", prompt: "This year, I want to celebrate..." },
  { month: "March", zh: "三月", char: "生", pinyin: "shēng", meaning: "to grow", line: "Let one small thing take root.", prompt: "This month, I want to plant..." },
  { month: "April", zh: "四月", char: "花", pinyin: "huā", meaning: "flower", line: "Bloom where no one is watching, too.", prompt: "This month, I want to notice..." },
  { month: "May", zh: "五月", char: "动", pinyin: "dòng", meaning: "to move", line: "Momentum is a gift to future you.", prompt: "This month, I want to move toward..." },
  { month: "June", zh: "六月", char: "光", pinyin: "guāng", meaning: "light", line: "Turn toward what warms you.", prompt: "This month, I want to enjoy..." },
  { month: "July", zh: "七月", char: "火", pinyin: "huǒ", meaning: "fire", line: "It is a Fire Goat year. Feed the fire you chose.", prompt: "This month, I want to commit to..." },
  { month: "August", zh: "八月", char: "友", pinyin: "yǒu", meaning: "friend", line: "Call the one you keep meaning to call.", prompt: "This month, I want to reach out to..." },
  { month: "September", zh: "九月", char: "学", pinyin: "xué", meaning: "to learn", line: "Be a beginner at something again.", prompt: "This month, I want to learn..." },
  { month: "October", zh: "十月", char: "收", pinyin: "shōu", meaning: "to harvest", line: "Gather what you have grown.", prompt: "This month, I am proud of..." },
  { month: "November", zh: "十一月", char: "静", pinyin: "jìng", meaning: "calm", line: "Make room for quiet.", prompt: "This month, I want to let go of..." },
  { month: "December", zh: "十二月", char: "家", pinyin: "jiā", meaning: "home", line: "Come home to yourself.", prompt: "This year, I am grateful for..." },
];

/** Printable art pieces at the end of the kit. */
export const KIT_PRINTS = [
  { char: "福", pinyin: "fú", meaning: "good fortune" },
  { char: "安", pinyin: "ān", meaning: "peace" },
  { char: "和", pinyin: "hé", meaning: "harmony" },
  { char: "喜", pinyin: "xǐ", meaning: "joy" },
  { char: "静", pinyin: "jìng", meaning: "calm" },
  { char: "春", pinyin: "chūn", meaning: "spring" },
] as const;

/** Lunar New Year 2027 (start of the Fire Goat year, 丁未). */
export const LNY_2027 = "Saturday, February 6, 2027";

/**
 * Lucky numbers and colors from Chinese zodiac folklore. Fact-checked Nov 12, 2026 against
 * China Highlights, Travel China Guide and chinesenewyear.net: only values cited by 2+ sources
 * are kept (Ox and Pig have little agreement, so their lists are short).
 */
export const LUCKY: Record<Animal, { numbers: number[]; colors: string[] }> = {
  rat: { numbers: [2, 3], colors: ["blue", "gold", "green"] },
  ox: { numbers: [1], colors: ["blue", "purple"] },
  tiger: { numbers: [1, 3, 4], colors: ["blue", "gray", "orange"] },
  rabbit: { numbers: [3, 4, 6], colors: ["red", "pink", "purple"] },
  dragon: { numbers: [1, 6, 7], colors: ["gold", "silver", "grayish white"] },
  snake: { numbers: [2, 8, 9], colors: ["black", "red", "yellow"] },
  horse: { numbers: [2, 3, 7], colors: ["yellow", "purple"] },
  goat: { numbers: [2, 7], colors: ["brown", "red", "purple"] },
  monkey: { numbers: [4, 9], colors: ["white", "blue", "gold"] },
  rooster: { numbers: [5, 7, 8], colors: ["gold", "brown", "yellow"] },
  dog: { numbers: [3, 4, 9], colors: ["red", "green", "purple"] },
  pig: { numbers: [4], colors: ["yellow"] },
};

// Traditional best matches: the six harmonies (六合) and the four trines (三合).
const HARMONIES: [Animal, Animal][] = [
  ["rat", "ox"], ["tiger", "pig"], ["rabbit", "dog"], ["dragon", "rooster"], ["snake", "monkey"], ["horse", "goat"],
];
const TRINES: Animal[][] = [
  ["rat", "dragon", "monkey"], ["ox", "snake", "rooster"], ["tiger", "horse", "dog"], ["rabbit", "goat", "pig"],
];

/** Best-matched signs for an animal: its harmony partner first, then its two trine partners. */
export function bestMatches(animal: Animal): Animal[] {
  const harmony = HARMONIES.find((p) => p.includes(animal))!.find((a) => a !== animal)!;
  const trine = TRINES.find((t) => t.includes(animal))!.filter((a) => a !== animal);
  return [harmony, ...trine];
}
