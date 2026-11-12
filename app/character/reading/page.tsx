import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getResult } from "@/lib/character";
import { accessQuery, getReadingAccess } from "@/lib/character/access";
import { ReadingView } from "./reading-view";
import "../character.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your full reading", robots: { index: false } };

export default async function ReadingPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const access = await getReadingAccess({ sessionId: session_id });
  const view = access && getResult(access.resultId);
  if (!access || !view) redirect("/character");
  return (
    <main className="quiz-main px-4 py-10">
      <ReadingView view={view} wallpaperQuery={accessQuery(access)} preordered={access.preordered} />
    </main>
  );
}
