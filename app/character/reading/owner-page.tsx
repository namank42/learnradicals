import { getResult } from "@/lib/character";
import { accessQuery, type ReadingAccess } from "@/lib/character/access";
import { buildReflection } from "@/lib/character/reflection";
import { signReading } from "@/lib/character/share-link";
import { ReadingView } from "./reading-view";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://learnradicals.com";

/** Shared by the paid page and the local preview: renders a reading for its owner. */
export function OwnerReading({ access }: { access: ReadingAccess }) {
  const view = getResult(access.resultId)!;
  return (
    <main className="quiz-main px-4 py-10">
      <ReadingView
        view={view}
        reflection={buildReflection(access.answers, view.character.char)}
        mode={{
          kind: "owner",
          wallpaperQuery: accessQuery(access),
          preordered: access.preordered,
          shareUrl: `${BASE}/character/s/${signReading(access.resultId, access.answers)}`,
        }}
      />
    </main>
  );
}
