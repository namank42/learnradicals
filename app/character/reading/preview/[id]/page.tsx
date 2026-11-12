import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResult } from "@/lib/character";
import { accessQuery, getReadingAccess } from "@/lib/character/access";
import { ReadingView } from "../../reading-view";
import "../../../character.css";

export const metadata: Metadata = { title: "Reading preview", robots: { index: false } };

/** Local-only preview of a full reading, no payment. 404s in production. */
export default async function ReadingPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const access = await getReadingAccess({ previewId: (await params).id });
  const view = access && getResult(access.resultId);
  if (!access || !view) notFound();
  return (
    <main className="quiz-main px-4 py-10">
      <ReadingView view={view} wallpaperQuery={accessQuery(access)} preordered={access.preordered} />
    </main>
  );
}
