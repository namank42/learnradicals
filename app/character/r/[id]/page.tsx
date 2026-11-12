import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getResult } from "@/lib/character";
import { readingPriceKey } from "@/lib/character/pricing";
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

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const view = getResult(id);
  if (!view) redirect("/character");

  const { character: c, animal, element } = view;
  const country = (await headers()).get("x-vercel-ip-country");
  const priceLabel = readingPriceKey(country) === "STRIPE_PRICE_READING_SEA" ? "$4" : "$7";

  return (
    <main className="min-h-[100dvh] px-4 py-12 md:py-20">
      <section className="mx-auto max-w-md text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-gray">Your Chinese character</p>

        <p className="quiz-char mt-6 text-[9rem] leading-none text-red" lang="zh">{c.char}</p>
        <p className="mt-4 text-xl text-ink">
          {c.pinyin} <span className="text-gray">·</span> {c.meaning}
        </p>

        <p className="mt-6 font-heading text-2xl font-bold leading-snug">&ldquo;{c.decode}&rdquo;</p>

        <p className="mt-5 text-gray">
          {c.parts.map((p, i) => (
            <span key={`${p.char}-${i}`}>
              {i > 0 && <span className="mx-2 text-gray-light">+</span>}
              <span className="quiz-char text-ink" lang="zh">{p.char}</span> {p.gloss}
            </span>
          ))}
        </p>

        <div className="mt-8 rounded-2xl border-l-4 border-l-gold bg-white px-5 py-4 text-left shadow-lg shadow-black/5">
          <p className="font-heading text-lg font-bold">
            {cap(element.element)} {cap(animal.animal)}{" "}
            <span className="quiz-char text-gold" lang="zh">{element.zh}{animal.zh}</span>
          </p>
          <p className="mt-1 text-sm text-gray">By birth year. {animal.badge} {element.badge}</p>
        </div>

        {/* Unlock is wired to Stripe in Task 6. */}
        <button
          disabled
          className="mt-8 w-full cursor-not-allowed rounded-2xl bg-red/60 px-8 py-5 text-lg font-medium text-white"
        >
          Unlock your full reading — {priceLabel}
        </button>
        <p className="mt-3 text-sm text-gray">What {c.char} says about you, your animal and element, and 3 wallpapers.</p>

        <p className="mt-10 text-xs leading-relaxed text-gray">
          Your animal and element come from the Chinese zodiac. Your character is Luna&rsquo;s match
          for your answers — a poetic reading, just for fun.
        </p>
        <Link href="/character" className="mt-4 inline-block text-sm text-gray underline hover:text-ink">
          Not you? Take the quiz
        </Link>
      </section>
    </main>
  );
}
