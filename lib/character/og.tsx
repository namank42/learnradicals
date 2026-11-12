// Server-only: shared JSX for next/og images (link preview, Story card, wallpapers).
// satori layout rules: every element with more than one child needs display: flex.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ResultView } from "./index";

let fontPromise: Promise<Buffer> | null = null;

/** Quiz Serif subset (OTF; satori can't read WOFF2). Read once per server instance. */
export function quizFont(): Promise<Buffer> {
  fontPromise ??= readFile(join(process.cwd(), "assets/fonts/quiz-serif.otf"));
  return fontPromise;
}

export async function ogFonts() {
  return [{ name: "Quiz Serif", data: await quizFont(), weight: 700 as const, style: "normal" as const }];
}

const C = {
  paper: "#faf8f4",
  cream: "#f3efe8",
  ink: "#1a1a1a",
  red: "#cc3425",
  gold: "#b8860b",
  gray: "#6b6560",
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export type CardFormat = "og" | "story" | "wallpaper";

export const CARD_SIZES: Record<CardFormat, { width: number; height: number }> = {
  og: { width: 1200, height: 630 },
  story: { width: 1080, height: 1920 },
  wallpaper: { width: 1170, height: 2532 },
};

export function ResultCard({
  view,
  format,
  variant = 1,
}: {
  view: ResultView;
  format: CardFormat;
  variant?: 1 | 2 | 3;
}) {
  const { character: c, animal, element, pair } = view;
  const yearLine = `${cap(element.element)} ${cap(animal.animal)} ${element.zh}${animal.zh}`;

  if (format === "og") {
    return (
      <div style={{ display: "flex", width: "100%", height: "100%", background: C.paper, fontFamily: "Quiz Serif", padding: 60 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 430, fontSize: 340, color: C.red }}>
          {c.char}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, paddingLeft: 40 }}>
          <div style={{ display: "flex", fontSize: 30, color: C.gray, letterSpacing: 4 }}>MY CHINESE CHARACTER</div>
          <div style={{ display: "flex", fontSize: 44, color: C.ink, marginTop: 18 }}>{`${c.pinyin} · ${c.meaning}`}</div>
          <div style={{ display: "flex", fontSize: 40, color: C.ink, marginTop: 24, lineHeight: 1.3 }}>{c.decode}</div>
          <div style={{ display: "flex", fontSize: 32, color: C.gold, marginTop: 28 }}>{yearLine}</div>
          <div style={{ display: "flex", fontSize: 26, color: C.gray, marginTop: 30 }}>What&apos;s yours? learnradicals.com/character</div>
        </div>
      </div>
    );
  }

  const tall = format === "wallpaper";
  const showDecode = format === "story" || variant === 2;
  const showPair = format === "wallpaper" && variant === 3;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: C.paper,
        fontFamily: "Quiz Serif",
        padding: tall ? "0 110px" : "0 100px",
        textAlign: "center",
      }}
    >
      {format === "story" && (
        <div style={{ display: "flex", fontSize: 40, color: C.gray, letterSpacing: 6 }}>MY CHINESE CHARACTER</div>
      )}
      <div style={{ display: "flex", fontSize: tall ? 620 : 560, lineHeight: 1, color: C.red, marginTop: format === "story" ? 40 : 0 }}>
        {c.char}
      </div>
      <div style={{ display: "flex", fontSize: tall ? 56 : 60, color: C.ink, marginTop: 30 }}>{`${c.pinyin} · ${c.meaning}`}</div>
      {showDecode && (
        <div style={{ display: "flex", fontSize: tall ? 58 : 62, color: C.ink, marginTop: 60, lineHeight: 1.3 }}>
          {c.decode}
        </div>
      )}
      {showPair && (
        <div style={{ display: "flex", alignItems: "center", marginTop: 80, fontSize: 60, color: C.gray }}>
          <span>with</span>
          <span style={{ fontSize: 200, color: C.gold, marginLeft: 40 }}>{pair.char}</span>
        </div>
      )}
      {format === "story" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 50, color: C.gold, marginTop: 70 }}>{yearLine}</div>
          <div style={{ display: "flex", fontSize: 38, color: C.gray, marginTop: 120 }}>What&apos;s yours?</div>
          <div style={{ display: "flex", fontSize: 38, color: C.gray, marginTop: 10 }}>learnradicals.com/character</div>
        </div>
      )}
    </div>
  );
}
