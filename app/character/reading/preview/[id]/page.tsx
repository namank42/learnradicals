import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getReadingAccess } from "@/lib/character/access";
import { OwnerReading } from "../../owner-page";
import "../../../character.css";

export const metadata: Metadata = { title: "Reading preview", robots: { index: false } };

/** Local-only preview of a paid reading (?a=3102 to include answers). 404s in production. */
export default async function ReadingPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ a?: string }>;
}) {
  const access = await getReadingAccess({ previewId: (await params).id, previewAnswers: (await searchParams).a });
  if (!access) notFound();
  return <OwnerReading access={access} />;
}
