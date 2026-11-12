import { QUESTIONS } from "./content/questions";

type Birth = { y: number; m: number; d: number };

/**
 * answers: answer index (0–3) per question, in QUESTIONS order.
 * Sums answer weights and returns the top slug. Ties are broken by birth date,
 * so the same person always gets the same result.
 */
export function scoreCharacter(answers: number[], birth: Birth): string {
  if (answers.length !== QUESTIONS.length) {
    throw new RangeError(`Expected ${QUESTIONS.length} answers`);
  }
  const totals = new Map<string, number>();
  answers.forEach((ai, qi) => {
    const answer = QUESTIONS[qi].answers[ai];
    if (!Number.isInteger(ai) || !answer) throw new RangeError(`Bad answer ${ai} for question ${qi}`);
    for (const [slug, w] of Object.entries(answer.weights)) {
      totals.set(slug, (totals.get(slug) ?? 0) + w);
    }
  });

  const max = Math.max(...totals.values());
  const tied = [...totals].filter(([, v]) => v === max).map(([k]) => k).sort();
  const seed = birth.y * 372 + birth.m * 31 + birth.d;
  return tied[seed % tied.length];
}
