import type { Metadata } from "next";
import { Quiz } from "./quiz";
import "./character.css";

export const metadata: Metadata = {
  title: "What's Your Chinese Character? A Chinese Character Quiz",
  description:
    "Four quick taps and your birthday. Find the Chinese character that reads like you, plus your zodiac animal and year element.",
  alternates: { canonical: "/character" },
  openGraph: {
    title: "What's your Chinese character?",
    description: "Find the Chinese character that reads like you, plus your zodiac animal and year element. Free, under a minute.",
    url: "/character",
    images: [{ url: "/og-character.png", width: 1200, height: 630, alt: "Chinese character quiz" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What's your Chinese character?",
    description: "Find the Chinese character that reads like you, plus your zodiac animal and year element.",
    images: ["/og-character.png"],
  },
};

export default function CharacterQuizPage() {
  return (
    <main className="quiz-main flex min-h-[100dvh] justify-center px-4 py-6 md:items-center md:py-20">
      <Quiz />
    </main>
  );
}
