import type { Metadata } from "next";
import { getResult } from "@/lib/character";
import { EXAMPLE_READING } from "@/lib/character/example";
import { decodeResultId } from "@/lib/character/ids";
import { buildReflection } from "@/lib/character/reflection";
import { ReadingView } from "../reading-view";
import "../../character.css";

export const metadata: Metadata = {
  title: "Example reading — What's Your Chinese Character?",
  description: "See exactly what a full Chinese character reading includes.",
  alternates: { canonical: "/character/reading/example" },
};

/** Public example reading. ?from=<resultId> sends the CTA back to the visitor's own result. */
export default async function ExampleReadingPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const from = (await searchParams).from ?? null;
  const view = getResult(EXAMPLE_READING.id)!;
  return (
    <main className="quiz-main px-4 py-10">
      <ReadingView
        view={view}
        reflection={buildReflection([...EXAMPLE_READING.answers], view.character.char)}
        mode={{ kind: "example", backToId: from && decodeResultId(from) ? from : null }}
      />
    </main>
  );
}
