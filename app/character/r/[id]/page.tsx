import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getResult } from "@/lib/character";
import { readingPriceKey } from "@/lib/character/pricing";
import { ShareButton } from "./share-button";
import "../../character.css";

type Props = { params: Promise<{ id: string }> };

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const view = getResult((await params).id);
  if (!view) return {};
  const { character: c, animal, element } = view;
  return {
    title: `${c.char} (${c.meaning}) — my Chinese character`,
    description: `${c.decode} ${cap(element.element)} ${cap(animal.animal)}. What's yours?`,
    robots: { index: false },
  };
}

// Designed to fit one phone screen (375×~700 inside an in-app browser) without scrolling.
export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const view = getResult(id);
  if (!view) redirect("/character");

  const { character: c, animal, element } = view;
  const country = (await headers()).get("x-vercel-ip-country");
  const priceLabel = readingPriceKey(country) === "STRIPE_PRICE_READING_SEA" ? "$4" : "$7";

  return (
    <main className="quiz-main flex min-h-[100dvh] justify-center px-4 py-6 md:items-center">
      <section className="flex w-full max-w-md flex-col items-center text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray/80">Your Chinese character</p>

        <p className="quiz-char mt-3 text-[6.5rem] leading-none text-red" lang="zh">{c.char}</p>
        <p className="mt-2 text-lg text-ink">
          {c.pinyin} <span className="text-gray">·</span> {c.meaning}
        </p>

        <p className="mt-4 font-heading text-[1.35rem] font-bold leading-snug">&ldquo;{c.decode}&rdquo;</p>

        <p className="mt-3 text-sm text-gold">
          {cap(element.element)} {cap(animal.animal)}{" "}
          <span className="quiz-char" lang="zh">{element.zh}{animal.zh}</span>
          <span className="text-gray"> · by birth year</span>
        </p>

        {/* Unlock is the primary action; wired to Stripe in Task 6. */}
        <button
          disabled
          title="Checkout coming soon"
          className="cta-button mt-6 w-full rounded-2xl bg-red px-8 py-5 text-lg font-medium text-white disabled:cursor-not-allowed"
        >
          Unlock your full reading — {priceLabel}
        </button>
        <p className="mt-2 text-xs text-gray">What {c.char} says about you, your animal and element, plus 3 wallpapers.</p>

        <div className="mt-4">
          <ShareButton id={id} char={c.char} decode={c.decode} variant="link" />
        </div>

        <p className="mt-5 text-[11px] leading-relaxed text-gray/80">
          Animal and element from the Chinese zodiac. Your character is matched from your answers — a poetic
          reading, just for fun. <Link href="/character" className="underline hover:text-ink">Take the quiz</Link>
        </p>
      </section>
    </main>
  );
}
