import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getReadingAccess } from "@/lib/character/access";
import { OwnerReading } from "./owner-page";
import "../character.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your full reading", robots: { index: false } };

export default async function ReadingPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const access = await getReadingAccess({ sessionId: (await searchParams).session_id });
  if (!access) redirect("/character");
  return <OwnerReading access={access} />;
}
