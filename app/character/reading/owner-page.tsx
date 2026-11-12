import { headers } from "next/headers";
import { getResult } from "@/lib/character";
import { displayPrices } from "@/lib/character/pricing";
import { accessQuery, type ReadingAccess } from "@/lib/character/access";
import { buildReflection } from "@/lib/character/reflection";
import { signReading } from "@/lib/character/share-link";
import { ReadingView } from "./reading-view";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://learnradicals.com";

/** Shared by the paid page and the local preview: renders a reading for its owner. */
export async function OwnerReading({ access }: { access: ReadingAccess }) {
  const view = getResult(access.resultId)!;
  const prices = displayPrices((await headers()).get("x-vercel-ip-country"));
  return (
    <main className="quiz-main px-4 py-10">
      <ReadingView
        view={view}
        reflection={buildReflection(access.answers, view.character.char)}
        kitPrice={prices.kit}
        mode={{
          kind: "owner",
          wallpaperQuery: accessQuery(access),
          hasKit: access.hasKit,
          sessionId: access.sessionId,
          savedCard: access.savedCard ?? null,
          shareUrl: `${BASE}/character/s/${signReading(access.resultId, access.answers)}`,
        }}
      />
    </main>
  );
}
