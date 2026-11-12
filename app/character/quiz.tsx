"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@vercel/analytics";
import { QUESTIONS } from "@/lib/character/content/questions";
import { encodeResultId } from "@/lib/character/encode";
import { EXAMPLE_CARDS } from "@/lib/character/example";
import { scoreCharacter } from "@/lib/character/scoring";
import { getZodiac, MAX_BIRTH_YEAR, MIN_BIRTH_YEAR } from "@/lib/character/zodiac";

type Step = "hook" | "birth" | number | "done";
type Birth = { y: number; m: number; d: number };

const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];
const YEARS = Array.from({ length: MAX_BIRTH_YEAR - MIN_BIRTH_YEAR + 1 }, (_, i) => MAX_BIRTH_YEAR - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const selectClass =
  "w-full appearance-none rounded-xl border border-gray-light bg-white px-3 py-3 text-base text-ink focus:border-red focus:outline-none";

export function Quiz() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("hook");
  const [birth, setBirth] = useState<{ y: string; m: string; d: string }>({ y: "", m: "", d: "" });
  const [birthError, setBirthError] = useState("");
  const [answers, setAnswers] = useState<number[]>([]);

  function start() {
    track("quiz_start");
    setStep("birth");
  }

  function submitBirth() {
    const b: Birth = { y: Number(birth.y), m: Number(birth.m), d: Number(birth.d) };
    if (!b.y || !b.m || !b.d) return setBirthError("Pick your month, day and year.");
    try {
      getZodiac(b.y, b.m, b.d);
    } catch {
      return setBirthError("That date doesn't exist. Check the day.");
    }
    setBirthError("");
    setStep(0);
  }

  function answer(qi: number, ai: number) {
    const next = [...answers.slice(0, qi), ai];
    setAnswers(next);
    if (qi + 1 < QUESTIONS.length) return setStep(qi + 1);

    const b: Birth = { y: Number(birth.y), m: Number(birth.m), d: Number(birth.d) };
    const { animal, element } = getZodiac(b.y, b.m, b.d);
    const id = encodeResultId(scoreCharacter(next, b), animal, element);
    track("quiz_complete", { id });
    setStep("done");
    router.push(`/character/r/${id}`);
  }

  if (step === "hook") {
    return (
      <section className="mx-auto w-full max-w-md text-center">
        <CardFan />
        <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-gray/80">Chinese character quiz</p>
        <h1 className="mt-4 font-heading text-[clamp(2rem,8vw,2.75rem)] font-bold leading-[1.05] tracking-tight">
          Every Chinese character hides a story. <span className="text-red">Which one is yours?</span>
        </h1>
        <p className="mt-5 text-lg text-gray">
          Find the Chinese character that reads like you, plus your zodiac animal and year element.
        </p>
        <button
          onClick={start}
          className="cta-button mt-8 w-full rounded-2xl bg-red px-8 py-5 text-lg font-medium text-white"
        >
          Find my character
        </button>
        <p className="mt-3 text-sm text-gray">Free result &middot; No sign-up &middot; Under a minute</p>


        <p className="mt-6 text-sm text-gray">
          From{" "}
          <a href="https://threads.net/@lunalang42" target="_blank" rel="noopener noreferrer"
            className="font-medium text-ink underline">
            @lunalang42
          </a>
          , read by 100,000+ people a month on Threads.
        </p>
      </section>
    );
  }

  if (step === "birth") {
    return (
      <section className="mx-auto w-full max-w-md">
        <Progress at={0} />
        <h2 className="mt-8 font-heading text-2xl font-bold">When&rsquo;s your birthday?</h2>
        <p className="mt-2 text-gray">It sets your zodiac animal and year element.</p>
        <div className="mt-6 grid grid-cols-[1.4fr_1fr_1.2fr] gap-2">
          <select aria-label="Month" className={selectClass} value={birth.m}
            onChange={(e) => setBirth({ ...birth, m: e.target.value })}>
            <option value="">Month</option>
            {MONTHS.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
          </select>
          <select aria-label="Day" className={selectClass} value={birth.d}
            onChange={(e) => setBirth({ ...birth, d: e.target.value })}>
            <option value="">Day</option>
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select aria-label="Year" className={selectClass} value={birth.y}
            onChange={(e) => setBirth({ ...birth, y: e.target.value })}>
            <option value="">Year</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {birthError && <p className="mt-3 text-sm text-red" role="alert">{birthError}</p>}
        <button onClick={submitBirth}
          className="cta-button mt-8 w-full rounded-2xl bg-red px-8 py-4 text-lg font-medium text-white">
          Next
        </button>
      </section>
    );
  }

  if (typeof step === "number") {
    const q = QUESTIONS[step];
    return (
      <section className="mx-auto w-full max-w-md">
        <Progress at={step + 1} />
        <h2 className="mt-8 font-heading text-2xl font-bold leading-snug">{q.prompt}</h2>
        <div className="mt-6 flex flex-col gap-3">
          {q.answers.map((a, ai) => (
            <button key={a.label} onClick={() => answer(step, ai)}
              className="w-full rounded-2xl border border-gray-light bg-white px-5 py-4 text-left text-base text-ink transition-colors hover:border-red active:bg-red-soft/40">
              {a.label}
            </button>
          ))}
        </div>
        <button onClick={() => setStep(step === 0 ? "birth" : step - 1)}
          className="mt-6 text-sm text-gray hover:text-ink">
          &larr; Back
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-md text-center" aria-live="polite">
      <p className="quiz-char text-6xl text-red animate-pulse" aria-hidden="true">字</p>
      <p className="mt-6 text-gray">Reading your character…</p>
    </section>
  );
}

function Progress({ at }: { at: number }) {
  const total = QUESTIONS.length + 1;
  return (
    <div className="flex gap-1.5" aria-label={`Step ${at + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= at ? "bg-red" : "bg-gray-light/60"}`} />
      ))}
    </div>
  );
}

const FAN = [
  { rotate: -10, x: -96, y: 16, z: 1, delay: "0s" },
  { rotate: 0, x: 0, y: 0, z: 2, delay: "0.6s" },
  { rotate: 10, x: 96, y: 16, z: 1, delay: "1.2s" },
];

function CardFan() {
  return (
    <div className="relative mx-auto h-[190px] w-full max-w-[320px]" aria-hidden="true">
      {EXAMPLE_CARDS.map((card, i) => {
        const f = FAN[i];
        return (
          <div
            key={card.slug}
            className="absolute left-1/2 top-0"
            style={{ transform: `translateX(calc(-50% + ${f.x}px)) translateY(${f.y}px) rotate(${f.rotate}deg)`, zIndex: f.z }}
          >
            <div
              className="quiz-float flex h-[168px] w-[118px] flex-col items-center justify-center rounded-2xl border border-gray-light/60 bg-white shadow-xl shadow-black/10"
              style={{ animationDelay: f.delay }}
            >
              <span className="quiz-char text-[64px] leading-none text-red">{card.char}</span>
              <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-gray">{card.meaning}</span>
              <span className="quiz-char mt-1 text-xs text-gold">{card.parts[0]} + {card.parts[1]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
