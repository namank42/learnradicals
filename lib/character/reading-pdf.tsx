// Server-only: the buyer's full reading as a 5-page A4 PDF (next/og pages + pdf-lib).
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PDFDocument } from "pdf-lib";
import type { ResultView } from "./index";
import { quizFont } from "./og";
import { splitAbout } from "./reading";

const C = { paper: "#faf8f4", cream: "#f3efe8", ink: "#1a1a1a", red: "#cc3425", gold: "#b8860b", gray: "#6b6560", line: "#e4ddd0" };
const BASE = { width: 620, height: 877 };
const SCALE = 2; // 1240x1754 px, about 150 dpi on A4
const A4_PT = { width: 595.28, height: 841.89 };
const KIT_LINE = "Your 2027 Goat-year kit has the rest, month by month.";
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

let bodyFont: Promise<Buffer> | null = null;
const loadBody = () => (bodyFont ??= readFile(join(process.cwd(), "assets/fonts/body-sans.ttf")));

export const READING_PDF_PAGES = 5;

const u = (n: number) => n * SCALE;
const SERIF = "Quiz Serif";
const SANS = "Body Sans";

const Eyebrow = ({ children }: { children: string }) => (
  <div style={{ display: "flex", fontFamily: SERIF, fontSize: u(10.5), letterSpacing: u(2.5), color: C.gray }}>{children.toUpperCase()}</div>
);
const Body = ({ children, italic = false }: { children: string; italic?: boolean }) => (
  <div style={{ display: "flex", fontFamily: SANS, fontSize: u(14), lineHeight: 1.65, color: C.ink, marginTop: u(8), fontStyle: italic ? "italic" : "normal" }}>
    {children}
  </div>
);
const Block = ({ eyebrow, title, children }: { eyebrow: string; title?: string; children: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", marginTop: u(30) }}>
    <Eyebrow>{eyebrow}</Eyebrow>
    {title && <div style={{ display: "flex", fontFamily: SERIF, fontSize: u(21), marginTop: u(6) }}>{title}</div>}
    {children}
  </div>
);


function Page({ view, reflection, page }: { view: ResultView; reflection: string | null; page: number }) {
  const { character: c, animal, element, pair } = view;
  const about = splitAbout(c.about);
  const serif = SERIF;
  const sans = SANS;

  const header = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: serif, fontSize: u(11), color: C.gray, paddingBottom: u(10), borderBottom: `${u(1)}px solid ${C.line}` }}>
      <div style={{ display: "flex" }}>{`${c.char}  ${c.pinyin} · ${c.meaning}`}</div>
      <div style={{ display: "flex" }}>Your full reading</div>
    </div>
  );
  const footer = (
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: serif, fontSize: u(10), color: C.gray, marginTop: "auto", paddingTop: u(12) }}>
      <div style={{ display: "flex" }}>learnradicals.com/character</div>
      <div style={{ display: "flex" }}>{`${page} / ${READING_PDF_PAGES}`}</div>
    </div>
  );
  const frame = (children: React.ReactNode, withHeader = true) => (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: C.paper, padding: `${u(44)}px ${u(48)}px ${u(32)}px`, color: C.ink }}>
      {withHeader && header}
      {children}
      {footer}
    </div>
  );

  if (page === 1) {
    return frame(
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: u(10) }}>
        <Eyebrow>Your full reading</Eyebrow>
        <div style={{ display: "flex", fontFamily: serif, fontSize: u(200), lineHeight: 1, color: C.red, marginTop: u(22) }}>{c.char}</div>
        <div style={{ display: "flex", fontFamily: serif, fontSize: u(22), marginTop: u(16) }}>{`${c.pinyin} · ${c.meaning}`}</div>
        <div style={{ display: "flex", fontFamily: serif, fontSize: u(22), marginTop: u(16), textAlign: "center", justifyContent: "center", maxWidth: u(460), lineHeight: 1.35 }}>
          {c.decode}
        </div>
        <div style={{ display: "flex", fontFamily: serif, fontSize: u(14), color: C.gold, marginTop: u(14) }}>
          {`${cap(element.element)} ${cap(animal.animal)} ${element.zh}${animal.zh} · by birth year`}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: u(28) }}>
          {c.parts.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && <div style={{ display: "flex", fontFamily: serif, fontSize: u(18), color: C.gray, margin: `0 ${u(12)}px` }}>+</div>}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: u(96), padding: `${u(12)}px 0`, background: "#ffffff", borderRadius: u(12) }}>
                <div style={{ display: "flex", fontFamily: serif, fontSize: u(36) }}>{p.char}</div>
                <div style={{ display: "flex", fontFamily: sans, fontSize: u(10), color: C.gray, marginTop: u(4) }}>{p.gloss}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", fontFamily: serif, fontSize: u(18), color: C.gray, margin: `0 ${u(12)}px` }}>=</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: u(96), padding: `${u(12)}px 0`, background: C.red, borderRadius: u(12), color: "#ffffff" }}>
            <div style={{ display: "flex", fontFamily: serif, fontSize: u(36) }}>{c.char}</div>
            <div style={{ display: "flex", fontFamily: sans, fontSize: u(10), marginTop: u(4) }}>{c.meaning}</div>
          </div>
        </div>
        {reflection && (
          <div style={{ display: "flex", marginTop: u(30), padding: `${u(16)}px ${u(20)}px`, background: C.cream, borderRadius: u(14), fontFamily: sans, fontSize: u(12.5), lineHeight: 1.6, fontStyle: "italic" }}>
            {reflection}
          </div>
        )}
      </div>,
      false,
    );
  }

  if (page === 2) {
    return frame(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Block eyebrow={`What ${c.char} says about you`} title="Who you are">
          {about.who.map((para, i) => <Body key={i}>{para}</Body>)}
        </Block>
        {about.shadow && (
          <Block eyebrow="Your shadow side">
            <Body>{about.shadow}</Body>
          </Block>
        )}
        <Block eyebrow="What you need">
          <Body>{about.need}</Body>
        </Block>
      </div>,
    );
  }

  if (page === 3) {
    return frame(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Block eyebrow="In love" title="The people you let close">
          <Body>{c.love}</Body>
        </Block>
        <Block eyebrow="With money & work" title="What you're worth">
          <Body>{c.money}</Body>
        </Block>
        <Block eyebrow="For hard days">
          <div style={{ display: "flex", marginTop: u(10), padding: `${u(16)}px ${u(20)}px`, background: "#ffffff", borderLeft: `${u(4)}px solid ${C.red}`, borderRadius: u(10), fontFamily: serif, fontSize: u(16), lineHeight: 1.45 }}>
            {c.hardDays}
          </div>
        </Block>
      </div>,
    );
  }

  if (page === 4) {
    return frame(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Block eyebrow={`3 words with ${c.char}`} title="Carry it with you">
          {c.words.map((w) => (
            <div key={w.hanzi} style={{ display: "flex", alignItems: "center", marginTop: u(8), padding: `${u(10)}px ${u(14)}px`, background: "#ffffff", borderRadius: u(10) }}>
              <div style={{ display: "flex", fontFamily: serif, fontSize: u(20), color: C.red, width: u(110) }}>{w.hanzi}</div>
              <div style={{ display: "flex", fontFamily: serif, fontSize: u(12), color: C.gray, width: u(150) }}>{w.pinyin}</div>
              <div style={{ display: "flex", fontFamily: sans, fontSize: u(12), marginLeft: "auto" }}>{w.en}</div>
            </div>
          ))}
        </Block>
        <Block eyebrow="Your character pairs with" title={`${pair.char}  ${pair.meaning}`}>
          <Body>{pair.decode}</Body>
        </Block>
        <Block eyebrow="Your year animal" title={`${cap(animal.animal)}  ${animal.zh}`}>
          <Body>{animal.profile}</Body>
        </Block>
      </div>,
    );
  }

  return frame(
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Block eyebrow="Your year element" title={`${cap(element.element)}  ${element.zh}`}>
        <Body>{element.profile}</Body>
      </Block>
      <Block eyebrow="Your 2027" title="The Year of the Fire Goat  羊">
        <Body>{animal.goatYear.replace(KIT_LINE, "").trim()}</Body>
      </Block>
      <div style={{ display: "flex", marginTop: u(34), fontFamily: sans, fontSize: u(10), lineHeight: 1.6, color: C.gray }}>
        Your animal and element come from the Chinese zodiac for your birth year. Your character is matched to your answers.
      </div>
    </div>,
  );
}

async function pdfFonts() {
  return [
    { name: "Quiz Serif", data: await quizFont(), weight: 700 as const, style: "normal" as const },
    { name: "Body Sans", data: await loadBody(), weight: 400 as const, style: "normal" as const },
  ];
}

export async function buildReadingPdf(view: ResultView, reflection: string | null): Promise<Uint8Array> {
  const fonts = await pdfFonts();
  const pngs = await Promise.all(
    Array.from({ length: READING_PDF_PAGES }, async (_, i) => {
      const res = new ImageResponse(<Page view={view} reflection={reflection} page={i + 1} />, {
        width: BASE.width * SCALE,
        height: BASE.height * SCALE,
        fonts,
      });
      return new Uint8Array(await res.arrayBuffer());
    }),
  );
  const doc = await PDFDocument.create();
  doc.setTitle(`My Chinese character: ${view.character.char} (${view.character.meaning})`);
  doc.setAuthor("Learn Radicals");
  for (const png of pngs) {
    const img = await doc.embedPng(png);
    const page = doc.addPage([A4_PT.width, A4_PT.height]);
    page.drawImage(img, { x: 0, y: 0, width: A4_PT.width, height: A4_PT.height });
  }
  return doc.save();
}

/** One page as a PNG response (dev-only page check). */
export async function readingPageImage(view: ResultView, reflection: string | null, page: number): Promise<Response> {
  return new ImageResponse(<Page view={view} reflection={reflection} page={page} />, {
    width: BASE.width * SCALE,
    height: BASE.height * SCALE,
    fonts: await pdfFonts(),
  });
}
