import type { Metadata } from "next";
import { Quiz } from "./quiz";
import "./character.css";

export const metadata: Metadata = {
  title: "What's Your Chinese Character? A Chinese Character Quiz",
  description:
    "Four quick taps and your birthday. Find the Chinese character that reads like you, plus your zodiac animal and year element.",
  alternates: { canonical: "/character" },
};

export default function CharacterQuizPage() {
  return (
    <main className="flex min-h-[100dvh] justify-center px-4 py-12 md:items-center md:py-20">
      <Quiz />
    </main>
  );
}
