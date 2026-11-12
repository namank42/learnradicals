import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getReadingAccess } from "@/lib/character/access";
import { OwnerReading } from "../../owner-page";
import "../../../character.css";

export const metadata: Metadata = { title: "Reading preview", robots: { index: false } };

/** Local-only preview of a paid reading (?a=3102 adds answers, ?kit=1 shows the kit as bought). 404s in production. */
export default async function ReadingPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ a?: string; kit?: string }>;
}) {
  const sp = await searchParams;
  const access = await getReadingAccess({ previewId: (await params).id, previewAnswers: sp.a, previewKit: sp.kit === "1" });
  if (!access) notFound();
  return <OwnerReading access={access} />;
}
