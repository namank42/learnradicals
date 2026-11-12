import Link from "next/link";
import type { ResultView } from "@/lib/character";
import { splitAbout } from "@/lib/character/reading";
import { ShareButton } from "../share-button";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const PREORDER_LINE = "Your full 2027 Goat-year kit is coming — pre-order it below.";

function Section({ eyebrow, title, children }: { eyebrow: string; title?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray/80">{eyebrow}</p>
      {title && <h2 className="mt-2 font-heading text-2xl font-bold leading-snug">{title}</h2>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ReadingView({
  view,
  wallpaperQuery,
  preordered,
}: {
  view: ResultView;
  wallpaperQuery: string;
  preordered: boolean;
}) {
  const { character: c, animal, element, pair } = view;
  const about = splitAbout(c.about);
  const goatYear = animal.goatYear.replace(PREORDER_LINE, "").trim();
  const yearName = `${cap(element.element)} ${cap(animal.animal)}`;

  return (
    <article className="mx-auto w-full max-w-md pb-16 text-left">
      {/* Hero */}
      <header className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray/80">Your full reading</p>
        <p className="quiz-char mt-4 text-[8rem] leading-none text-red" lang="zh">{c.char}</p>
        <p className="mt-3 text-xl text-ink">
          {c.pinyin} <span className="text-gray">·</span> {c.meaning}
        </p>
        <p className="mt-4 font-heading text-2xl font-bold leading-snug">&ldquo;{c.decode}&rdquo;</p>
        <p className="mt-3 text-sm text-gold">
          {yearName} <span className="quiz-char" lang="zh">{element.zh}{animal.zh}</span>
          <span className="text-gray"> · by birth year</span>
        </p>
      </header>

      {/* Parts */}
      <div className="mt-10 flex items-stretch justify-center gap-3">
        {c.parts.map((p, i) => (
          <div key={`${p.char}-${i}`} className="flex items-center gap-3">
            {i > 0 && <span className="text-xl text-gray-light">+</span>}
            <div className="flex w-24 flex-col items-center rounded-2xl bg-white px-2 py-4 shadow-md shadow-black/5">
              <span className="quiz-char text-4xl text-ink" lang="zh">{p.char}</span>
              <span className="mt-2 text-center text-xs text-gray">{p.gloss}</span>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3">
          <span className="text-xl text-gray-light">=</span>
          <div className="flex w-24 flex-col items-center rounded-2xl bg-red px-2 py-4 text-white shadow-md shadow-red/20">
            <span className="quiz-char text-4xl" lang="zh">{c.char}</span>
            <span className="mt-2 text-center text-xs opacity-90">{c.meaning}</span>
          </div>
        </div>
      </div>

      <Section eyebrow={`What ${c.char} says about you`} title="Who you are">
        {about.who.map((para, i) => (
          <p key={i} className="mt-3 text-[17px] leading-relaxed text-ink first:mt-0">{para}</p>
        ))}
      </Section>

      {about.shadow && (
        <Section eyebrow="Your shadow side">
          <p className="text-[17px] leading-relaxed text-ink">{about.shadow}</p>
        </Section>
      )}

      <Section eyebrow="What you need">
        <p className="text-[17px] leading-relaxed text-ink">{about.need}</p>
      </Section>

      <Section eyebrow="For hard days">
        <blockquote className="rounded-2xl border-l-4 border-l-red bg-white px-5 py-5 font-heading text-xl font-bold leading-snug shadow-md shadow-black/5">
          {c.hardDays}
        </blockquote>
      </Section>

      <Section eyebrow={`3 words with ${c.char}`} title="Carry it with you">
        <ul className="grid gap-3">
          {c.words.map((w) => (
            <li key={w.hanzi} className="flex items-baseline gap-4 rounded-2xl bg-white px-5 py-4 shadow-md shadow-black/5">
              <span className="quiz-char text-2xl text-red" lang="zh">{w.hanzi}</span>
              <span className="text-sm text-gray">{w.pinyin}</span>
              <span className="ml-auto text-right text-sm text-ink">{w.en}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Your character pairs with" title={<><span className="quiz-char text-red" lang="zh">{pair.char}</span> {pair.meaning}</>}>
        <p className="text-[17px] leading-relaxed text-ink">&ldquo;{pair.decode}&rdquo;</p>
        <p className="mt-2 text-sm text-gray">Know someone who&rsquo;s a {pair.char}? Send them the quiz.</p>
      </Section>

      <Section eyebrow="Your year animal" title={<>{cap(animal.animal)} <span className="quiz-char text-gold" lang="zh">{animal.zh}</span></>}>
        <p className="text-[17px] leading-relaxed text-ink">{animal.profile}</p>
      </Section>

      <Section eyebrow="Your year element" title={<>{cap(element.element)} <span className="quiz-char text-gold" lang="zh">{element.zh}</span></>}>
        <p className="text-[17px] leading-relaxed text-ink">{element.profile}</p>
      </Section>

      <Section eyebrow="Your 2027" title={<>The Year of the Fire Goat <span className="quiz-char text-gold" lang="zh">羊</span></>}>
        <p className="text-[17px] leading-relaxed text-ink">{goatYear}</p>
        <div className="mt-5 rounded-2xl bg-cream px-5 py-5">
          {preordered ? (
            <p className="font-medium text-ink">Your 2027 Goat-year kit is pre-ordered. It arrives by email by Dec 20.</p>
          ) : (
            <>
              <p className="font-heading text-lg font-bold">The 2027 Goat-year kit</p>
              <p className="mt-1 text-sm text-gray">
                Digital download: a 2027 planner, your animal&rsquo;s lucky months, colors and characters, and printable art.
              </p>
              {/* Kit-only checkout is wired in Task 6. */}
              <button disabled className="mt-4 w-full rounded-2xl bg-ink px-6 py-4 font-medium text-paper disabled:cursor-not-allowed">
                Pre-order — $12
              </button>
            </>
          )}
        </div>
      </Section>

      <Section eyebrow="Wallpapers" title="Keep it on your lock screen">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((v) => (
            <a key={v} href={`/api/character/wallpaper?${wallpaperQuery}&v=${v}`} download className="group block">
              {/* eslint-disable-next-line @next/next/no-img-element -- dynamic next/og image */}
              <img
                src={`/api/character/wallpaper?${wallpaperQuery}&v=${v}`}
                alt={`Wallpaper ${v} for ${c.char}`}
                loading="lazy"
                className="aspect-[1170/2532] w-full rounded-xl bg-white shadow-md shadow-black/10 transition-transform group-hover:-translate-y-1"
              />
              <span className="mt-2 block text-center text-xs text-gray">Save &darr;</span>
            </a>
          ))}
        </div>
      </Section>

      <section className="mt-16 rounded-3xl bg-cream px-5 py-8 text-center">
        <h2 className="font-heading text-2xl font-bold">Share your character</h2>
        <p className="mt-2 text-gray">Your friends will want to know theirs.</p>
        {/* eslint-disable-next-line @next/next/no-img-element -- dynamic next/og image */}
        <img
          src={`/api/character/card/${view.id}`}
          alt={`My Chinese character card: ${c.char}`}
          loading="lazy"
          className="mx-auto mt-6 aspect-[9/16] w-full max-w-[220px] rounded-3xl bg-paper shadow-2xl shadow-black/15"
        />
        <div className="mt-6">
          <ShareButton id={view.id} char={c.char} decode={c.decode} />
        </div>
      </section>

      <p className="mt-10 text-center text-[11px] leading-relaxed text-gray/80">
        Your animal and element come from the Chinese zodiac for your birth year. Your character is matched to your answers.{" "}
        <Link href="/character" className="underline hover:text-ink">Take the quiz again</Link>
      </p>
    </article>
  );
}
