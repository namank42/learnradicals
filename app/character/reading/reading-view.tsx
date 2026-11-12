import Link from "next/link";
import type { ResultView } from "@/lib/character";
import { splitAbout } from "@/lib/character/reading";
import { Reveal } from "../reveal";
import { ShareButton } from "../share-button";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const KIT_LINE = "Your 2027 Goat-year kit has the rest, month by month.";

function Section({
  eyebrow,
  title,
  id,
  children,
}: {
  eyebrow: string;
  title?: React.ReactNode;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="mt-12">
      <section id={id} className="scroll-mt-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray/80">{eyebrow}</p>
        {title && <h2 className="mt-2 font-heading text-2xl font-bold leading-snug">{title}</h2>}
        <div className="mt-4">{children}</div>
      </section>
    </Reveal>
  );
}

/** Big "go back and unlock yours" call to action, repeated through the example reading. */
function ExampleCta({ mode }: { mode: Extract<ReadingMode, { kind: "example" }> }) {
  const back = mode.backTo;
  return (
    <Reveal className="mt-12">
      <div className="rounded-3xl bg-red px-6 py-7 text-center text-white">
        <p className="font-heading text-xl font-bold leading-snug">
          {back ? (
            <>
              Your character is <span className="quiz-char" lang="zh">{back.char}</span>. Read all of yours.
            </>
          ) : (
            "Find your own character and read all of it."
          )}
        </p>
        <Link
          href={back ? `/character/r/${back.id}` : "/character"}
          className="cta-button mt-5 block w-full rounded-2xl bg-white px-6 py-4 text-lg font-semibold text-red"
        >
          {back ? `Unlock my reading — ${mode.readingPrice}` : "Find my character"}
        </Link>
      </div>
    </Reveal>
  );
}

function KitPreviews({ animal }: { animal: string }) {
  return (
    <>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((p) => (
          // eslint-disable-next-line @next/next/no-img-element -- dynamic next/og image
          <img
            key={p}
            src={`/api/character/kit-preview?animal=${animal}&p=${p}`}
            alt={["Planner cover", "January planner page", "Printable art"][p - 1]}
            loading="lazy"
            className="aspect-[620/877] w-full rounded-lg bg-white shadow-md shadow-black/10"
          />
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] uppercase tracking-[0.18em] text-gray/80">Preview</p>
    </>
  );
}

export type ReadingMode =
  | { kind: "owner"; wallpaperQuery: string; hasKit: boolean; shareUrl: string }
  | { kind: "example"; backTo: { id: string; char: string } | null; readingPrice: string }
  | { kind: "shared" };

export function ReadingView({
  view,
  mode,
  reflection,
  kitPrice = "$5",
}: {
  view: ResultView;
  mode: ReadingMode;
  reflection?: string | null;
  /** Regional kit add-on label, e.g. "$5" or "$3". */
  kitPrice?: string;
}) {
  const owner = mode.kind === "owner" ? mode : null;
  const { character: c, animal, element, pair } = view;
  const about = splitAbout(c.about);
  const goatYear = animal.goatYear.replace(KIT_LINE, "").trim();
  const yearName = `${cap(element.element)} ${cap(animal.animal)}`;

  return (
    <article className="mx-auto w-full max-w-md pb-16 text-left">
      {mode.kind === "example" && (
        <div className="mb-10 rounded-2xl bg-cream px-4 py-3 text-center text-sm text-ink">
          <span className="font-semibold">Example reading.</span> This is exactly what you get for your own character.
        </div>
      )}
      {mode.kind === "shared" && (
        <div className="mb-10 rounded-2xl bg-cream px-4 py-3 text-center text-sm text-ink">
          Someone shared their reading with you. <span className="font-semibold">What&rsquo;s yours?</span>
        </div>
      )}

      {/* Hero */}
      <header className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray/80">
          {mode.kind === "owner" ? "Your full reading" : "Full reading"}
        </p>
        <p className="anim-ink quiz-char mt-4 text-[8rem] leading-none text-red" lang="zh">{c.char}</p>
        <p className="mt-3 text-xl text-ink">
          {c.pinyin} <span className="text-gray">·</span> {c.meaning}
        </p>
        <p className="mt-4 font-heading text-2xl font-bold leading-snug">&ldquo;{c.decode}&rdquo;</p>
        <p className="mt-3 text-sm text-gold">
          {yearName} <span className="quiz-char" lang="zh">{element.zh}{animal.zh}</span>
          <span className="text-gray"> · by birth year</span>
        </p>
        {owner && (
          <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-3">
            <a
              href={`/api/character/reading-pdf?${owner.wallpaperQuery}`}
              download
              className="flex items-center justify-center rounded-2xl border-2 border-ink px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Reading (PDF) &darr;
            </a>
            <a
              href="#wallpapers"
              className="flex items-center justify-center rounded-2xl border-2 border-ink px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Wallpapers &darr;
            </a>
          </div>
        )}
      </header>

      {/* Parts */}
      <div className="mt-12 flex items-stretch justify-center gap-2">
        {c.parts.map((p, i) => (
          <div key={`${p.char}-${i}`} className="anim-pop flex items-center gap-2" style={{ animationDelay: `${0.4 + i * 0.15}s` }}>
            {i > 0 && <span className="text-xl text-gray-light">+</span>}
            <div className="flex w-[5.25rem] flex-col items-center rounded-2xl bg-white px-2 py-4 shadow-md shadow-black/5">
              <span className="quiz-char text-4xl text-ink" lang="zh">{p.char}</span>
              <span className="mt-2 text-center text-xs text-gray">{p.gloss}</span>
            </div>
          </div>
        ))}
        <div className="anim-pop flex items-center gap-2" style={{ animationDelay: `${0.4 + c.parts.length * 0.15}s` }}>
          <span className="text-xl text-gray-light">=</span>
          <div className="flex w-[5.25rem] flex-col items-center rounded-2xl bg-red px-2 py-4 text-white shadow-md shadow-red/20">
            <span className="quiz-char text-4xl" lang="zh">{c.char}</span>
            <span className="mt-2 text-center text-xs opacity-90">{c.meaning}</span>
          </div>
        </div>
      </div>

      {reflection && (
        <p className="mt-12 rounded-2xl bg-white px-5 py-4 text-[17px] italic leading-relaxed text-ink shadow-md shadow-black/5">
          {reflection}
        </p>
      )}

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

      <Section eyebrow="In love" title="The people you let close">
        <p className="text-[17px] leading-relaxed text-ink">{c.love}</p>
      </Section>

      <Section eyebrow="With money & work" title="What you&rsquo;re worth">
        <p className="text-[17px] leading-relaxed text-ink">{c.money}</p>
      </Section>

      {mode.kind === "example" && <ExampleCta mode={mode} />}

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
        {owner && (
          <div className="mt-5 rounded-2xl bg-cream px-5 py-5">
            {owner?.hasKit ? (
              <>
                <p className="font-heading text-lg font-bold">Your 2027 Goat-year kit</p>
                <p className="mt-1 text-sm text-gray">
                  20 pages: your {cap(animal.animal)} edition cover, your lucky guide, 12 planner months and 6 printable art pieces.
                </p>
                <KitPreviews animal={animal.animal} />
                <a
                  href={`/api/character/kit?${owner.wallpaperQuery}`}
                  download
                  className="mt-4 flex w-full items-center justify-center rounded-2xl bg-ink px-6 py-4 font-medium text-paper"
                >
                  Download your kit (PDF) &darr;
                </a>
              </>
            ) : (
              <>
                <p className="font-heading text-lg font-bold">The 2027 Goat-year kit</p>
                <p className="mt-1 text-sm text-gray">
                  A 20-page digital download: your {cap(animal.animal)} edition planner, your lucky colors, numbers and best
                  matches, 12 months with a character for each, and 6 printable art pieces.
                </p>
                <KitPreviews animal={animal.animal} />
                {/* Kit-only checkout is wired in Task 6. */}
                <button disabled className="mt-4 w-full rounded-2xl bg-ink px-6 py-4 font-medium text-paper disabled:cursor-not-allowed">
                  {`Get the kit — ${kitPrice}`}
                </button>
              </>
            )}
          </div>
        )}
      </Section>

      {owner && (
        <Section id="wallpapers" eyebrow="Wallpapers" title="Keep it on your lock screen">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((v) => (
              <a key={v} href={`/api/character/wallpaper?${owner.wallpaperQuery}&v=${v}`} download className="group block">
                {/* eslint-disable-next-line @next/next/no-img-element -- dynamic next/og image */}
                <img
                  src={`/api/character/wallpaper?${owner.wallpaperQuery}&v=${v}`}
                  alt={`Wallpaper ${v} for ${c.char}`}
                  loading="lazy"
                  className="aspect-[1170/2532] w-full rounded-xl bg-white shadow-md shadow-black/10 transition-transform group-hover:-translate-y-1"
                />
                <span className="mt-2 block text-center text-xs text-gray">Save &darr;</span>
              </a>
            ))}
          </div>
        </Section>
      )}
      {mode.kind === "example" && (
        <Section eyebrow="Wallpapers" title="3 wallpapers, made for your character">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((v) => (
              // eslint-disable-next-line @next/next/no-img-element -- dynamic next/og image
              <img
                key={v}
                src={`/api/character/wallpaper?example=1&v=${v}`}
                alt={`Example wallpaper ${v}`}
                loading="lazy"
                className="aspect-[1170/2532] w-full rounded-xl bg-white shadow-md shadow-black/10"
              />
            ))}
          </div>
        </Section>
      )}

      {owner ? (
        <Reveal className="mt-12">
          <section className="text-center">
            <h2 className="font-heading text-2xl font-bold">Save &amp; share your reading</h2>
            <p className="mt-2 text-gray">Keep the whole reading, or send it to a friend.</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- dynamic next/og image */}
            <img
              src={`/api/character/card/${view.id}`}
              alt={`My Chinese character card: ${c.char}`}
              loading="lazy"
              className="mx-auto mt-6 aspect-[9/16] w-full max-w-[240px] rounded-2xl shadow-xl shadow-black/15"
            />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href={`/api/character/reading-pdf?${owner.wallpaperQuery}`}
                download
                className="flex items-center justify-center rounded-2xl border-2 border-ink px-3 py-4 text-base font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Reading (PDF) &darr;
              </a>
              <ShareButton
                id={view.id}
                char={c.char}
                decode={c.decode}
                url={owner.shareUrl}
                text={`My Chinese character reading: ${c.char}, ${c.meaning}. “${c.decode}” What's yours?`}
                label="Share reading"
                compact
              />
            </div>
            <a
              href={`/api/character/card/${view.id}`}
              download
              className="mt-4 inline-block text-sm text-gray underline underline-offset-2 hover:text-ink"
            >
              Save card image &darr;
            </a>
          </section>
        </Reveal>
      ) : (
        mode.kind === "example" ? (
          <ExampleCta mode={mode} />
        ) : (
          <section className="mt-12 rounded-3xl bg-ink px-5 py-8 text-center text-paper">
            <h2 className="font-heading text-2xl font-bold">What&rsquo;s your Chinese character?</h2>
            <p className="mt-2 text-paper/70">Your birthday and four quick taps. Under a minute.</p>
            <Link
              href="/character"
              className="cta-button mt-6 inline-block w-full rounded-2xl bg-red px-8 py-4 text-lg font-medium text-white"
            >
              Find my character
            </Link>
          </section>
        )
      )}

      <p className="mx-auto mt-12 max-w-xs text-balance text-center text-[11px] leading-relaxed text-gray/80">
        Your animal and element come from the Chinese zodiac for your birth year. Your character is matched to your answers.
      </p>
      <p className="mt-2 text-center">
        <Link href="/character" className="text-[11px] text-gray/80 underline underline-offset-2 hover:text-ink">
          Take the quiz again
        </Link>
      </p>
    </article>
  );
}
