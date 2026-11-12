import type { QuizQuestion } from "../types";

// Each slug appears in exactly two answers, in two different questions:
// 16 slugs as (3, 1) and 8 slugs as (2, 2), so every slug can reach a total of 4.
// Simulated over all 256 answer combos: every slug wins 3.1–5.1% of results.
export const QUESTIONS: QuizQuestion[] = [
  {
    id: "sunday",
    prompt: "It's Sunday and nothing is planned. You…",
    answers: [
      { label: "Text the group chat and make a plan", reflect: "text the group chat and make a plan", weights: { friend: 3, harmony: 2, joy: 1 } },
      { label: "Stay in with a book and a blanket", reflect: "stay in with a book and a blanket", weights: { rest: 3, thinking: 2, dream: 1 } },
      { label: "Walk somewhere green until your head clears", reflect: "walk somewhere green until the noise clears", weights: { alive: 3, fragrance: 2, healing: 1 } },
      { label: "Finally do the hard thing you've been putting off", reflect: "finally do the hard thing that keeps getting put off", weights: { endurance: 3, wish: 2, wisdom: 1 } },
    ],
  },
  {
    id: "comefor",
    prompt: "What do people come to you for?",
    answers: [
      { label: "Someone who actually listens", reflect: "someone who actually listens", weights: { sympathy: 3, partner: 2, kindness: 1 } },
      { label: "Honest advice, even when it stings", reflect: "honest advice, even when it stings", weights: { wisdom: 3, trust: 2, realizing: 1 } },
      { label: "A place that feels like home", reflect: "a place that feels like home", weights: { home: 3, harmony: 2, loyalty: 1 } },
      { label: "A laugh when everything's too heavy", reflect: "a laugh when everything's too heavy", weights: { joy: 3, immortal: 2, cute: 1 } },
    ],
  },
  {
    id: "lockscreen",
    prompt: "Pick the line you'd put on your lock screen.",
    answers: [
      { label: "Slow is still moving.", reflect: "Slow is still moving.", weights: { healing: 3, thinking: 2, endurance: 1 } },
      { label: "Be the person you needed.", reflect: "Be the person you needed.", weights: { kindness: 3, trust: 2, sympathy: 1 } },
      { label: "Dream anyway.", reflect: "Dream anyway.", weights: { dream: 3, immortal: 2, courage: 1 } },
      { label: "Feel all of it.", reflect: "Feel all of it.", weights: { feeling: 3, treasure: 2, alive: 1 } },
    ],
  },
  {
    id: "wantmore",
    prompt: "What do you secretly want more of?",
    answers: [
      { label: "People who stay", reflect: "more people who stay", weights: { loyalty: 3, partner: 2, friend: 1 } },
      { label: "Quiet mornings to think", reflect: "more quiet mornings to think", weights: { realizing: 3, fragrance: 2, rest: 1 } },
      { label: "A brave new chapter", reflect: "a brave new chapter", weights: { courage: 3, wish: 2, feeling: 1 } },
      { label: "Small, soft, happy things", reflect: "more small, soft, happy things", weights: { cute: 3, treasure: 2, home: 1 } },
    ],
  },
];
