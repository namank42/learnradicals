import type { Metadata } from "next";
import { Quiz } from "./quiz";
import "./character.css";

export const metadata: Metadata = {
  title: "What's Your Chinese Character? — Luna",
  description:
    "Four quick taps and your birthday. Find the Chinese character that reads like you, plus your zodiac animal and year element.",
  alternates: { canonical: "/character" },
};

export default function CharacterQuizPage() {
  return (
    <main className="min-h-[100dvh] px-4 py-12 md:py-20">
      <Quiz />
    </main>
  );
}
