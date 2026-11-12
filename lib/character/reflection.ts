import { QUESTIONS } from "./content/questions";

/**
 * Quotes the visitor's own answers back at the top of the paid reading, e.g.
 * "You said you'd stay in with a book and a blanket, that people come to you for honest advice…
 *  That's 慧."
 */
export function buildReflection(
  answers: number[] | null,
  char: string,
  person: "you" | "they" = "you",
): string | null {
  if (!answers || answers.length !== QUESTIONS.length) return null;
  const r = answers.map((ai, qi) => QUESTIONS[qi].answers[ai]?.reflect);
  if (r.some((x) => !x)) return null;
  const [sunday, comeFor, line, wantMore] = r as string[];
  const p =
    person === "you"
      ? { said: "You said you'd", obj: "you", poss: "your", subj: "you" }
      : { said: "They said they'd", obj: "them", poss: "their", subj: "they" };
  return (
    `${p.said} ${sunday} on a free Sunday, that people come to ${p.obj} for ${comeFor}, ` +
    `that “${line}” belongs on ${p.poss} lock screen, and that ${p.subj} secretly want ${wantMore}. That's ${char}.`
  );
}

/** "3102" -> [3,1,0,2]; anything malformed -> null. */
export function parseAnswers(raw: string | null | undefined): number[] | null {
  if (!raw || !/^[0-3]{4}$/.test(raw)) return null;
  return [...raw].map(Number);
}
