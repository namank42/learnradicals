import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResult } from "@/lib/character";
import { buildReflection } from "@/lib/character/reflection";
import { verifyReadingToken } from "@/lib/character/share-link";
import { ReadingView } from "../../reading/reading-view";
import "../../character.css";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shared = verifyReadingToken((await params).token);
  const view = shared && getResult(shared.resultId);
  if (!view) return {};
  const c = view.character;
  return {
    title: `${c.char} (${c.meaning}) — a full Chinese character reading`,
    description: `${c.decode} What's your Chinese character?`,
    robots: { index: false },
    openGraph: { images: [`/character/r/${view.id}/opengraph-image`] },
  };
}

/** A buyer's full reading, shared by a signed link. */
export default async function SharedReadingPage({ params }: Props) {
  const shared = verifyReadingToken((await params).token);
  const view = shared && getResult(shared.resultId);
  if (!shared || !view) notFound();
  return (
    <main className="quiz-main px-4 py-10">
      <ReadingView
        view={view}
        reflection={buildReflection(shared.answers, view.character.char, "they")}
        mode={{ kind: "shared" }}
      />
    </main>
  );
}
