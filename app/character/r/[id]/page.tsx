import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getResult } from "@/lib/character";
import { displayPrices } from "@/lib/character/pricing";
import { ShareButton } from "../../share-button";
import { UnlockSheet } from "./unlock-sheet";
import { EmailCapture } from "./email-capture";
import "../../character.css";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ a?: string }> };

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

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
export default async function ResultPage({ params, searchParams }: Props) {
  const { id } = await params;
  const raw = (await searchParams).a;
  const answers = raw && /^[0-3]{4}$/.test(raw) ? raw : null;
  const view = getResult(id);
  if (!view) redirect("/character");

  const { character: c, animal, element } = view;
  const country = (await headers()).get("x-vercel-ip-country");
  const priceLabel = displayPrices(country).reading;

  return (
    <main className="quiz-main flex min-h-[100dvh] justify-center px-4 py-6 md:items-center">
      <section className="flex w-full max-w-md flex-col items-center text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray/80">Your Chinese character</p>

        <p className="anim-ink quiz-char mt-3 text-[6.5rem] leading-none text-red" lang="zh">{c.char}</p>
        <p className="anim-rise mt-2 text-lg text-ink" style={{ animationDelay: "0.25s" }}>
          {c.pinyin} <span className="text-gray">·</span> {c.meaning}
        </p>

        <p className="anim-rise mt-4 font-heading text-[1.35rem] font-bold leading-snug" style={{ animationDelay: "0.4s" }}>&ldquo;{c.decode}&rdquo;</p>

        <p className="anim-rise mt-3 text-sm text-gold" style={{ animationDelay: "0.55s" }}>
          {cap(element.element)} {cap(animal.animal)}{" "}
          <span className="quiz-char" lang="zh">{element.zh}{animal.zh}</span>
          <span className="text-gray"> · by birth year</span>
        </p>
        <div className="anim-rise mt-2 space-y-1 text-balance text-[15px] leading-snug" style={{ animationDelay: "0.6s" }}>
          <p className="text-ink">Tradition says you&rsquo;re {lower(animal.badge)}</p>
          <p className="text-gray">
            <span className="quiz-char text-red" lang="zh">{element.zh}</span> {cap(element.element)}: {lower(element.badge)}
          </p>
        </div>

        <UnlockSheet
          id={id}
          char={c.char}
          answers={answers}
          priceLabel={priceLabel}
          className="anim-rise cta-button mt-6 w-full rounded-2xl bg-red px-8 py-5 text-lg font-medium text-white"
          style={{ animationDelay: "0.7s" }}
        />
        <p className="mt-3 text-balance text-xs leading-relaxed text-gray">
          Your full {cap(element.element)} {cap(animal.animal)} profile, what {c.char} says about you in love and money, plus 3 wallpapers.
        </p>
        <Link
          href={`/character/reading/example?from=${id}`}
          className="mt-1 text-xs font-medium text-ink underline underline-offset-2"
        >
          See an example reading &rarr;
        </Link>

        <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <ShareButton id={id} char={c.char} decode={c.decode} variant="link" />
          <EmailCapture id={id} />
        </div>

        <p className="mx-auto mt-6 max-w-xs text-balance text-[11px] leading-relaxed text-gray/80">
          Your animal and element come from the Chinese zodiac for your birth year. Your character is matched to your
          answers.
        </p>
        <Link href="/character" className="mt-2 text-[11px] text-gray/80 underline underline-offset-2 hover:text-ink">
          Take the quiz again
        </Link>
      </section>
    </main>
  );
}
