// Server-only: pages of the 2027 Goat-year kit, rendered with next/og.
// Designed on a 620x877 (A-series) canvas; `scale` 2 gives 1240x1754 for the PDF.
import { ANIMAL_PROFILES } from "./content/animals";
import { bestMatches, KIT_MONTHS, KIT_PRINTS, LNY_2027, LUCKY } from "./content/kit";
import type { AnimalProfile } from "./types";

const C = { paper: "#faf8f4", cream: "#f3efe8", ink: "#1a1a1a", red: "#cc3425", gold: "#b8860b", gray: "#6b6560", line: "#e4ddd0" };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const KIT_LINE = "Your 2027 Goat-year kit has the rest, month by month.";

export const KIT_BASE = { width: 620, height: 877 };

export type KitPageSpec =
  | { kind: "cover" }
  | { kind: "year" }
  | { kind: "month"; index: number }
  | { kind: "print"; index: number };

/** Every page of the kit, in order (1 + 1 + 12 + 6 = 20). */
export const KIT_PAGES: KitPageSpec[] = [
  { kind: "cover" },
  { kind: "year" },
  ...KIT_MONTHS.map((_, index) => ({ kind: "month" as const, index })),
  ...KIT_PRINTS.map((_, index) => ({ kind: "print" as const, index })),
];

/** Calendar cells for a 2027 month (0 = January), Sunday-first weeks, padded with nulls. */
export function kitCalendar(monthIndex: number): (number | null)[] {
  const first = new Date(Date.UTC(2027, monthIndex, 1)).getUTCDay();
  const days = new Date(Date.UTC(2027, monthIndex + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  return cells;
}

function WritingLines({ u, count, color }: { u: (n: number) => number; count: number; color: string }) {
  // satori doesn't stretch flex children reliably, so lines use a fixed rhythm that fills the page.
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ display: "flex", height: u(1), background: color, marginTop: u(36), flexShrink: 0 }} />
      ))}
    </div>
  );
}

export function KitPage({ spec, animal, scale = 1 }: { spec: KitPageSpec; animal: AnimalProfile; scale?: number }) {
  const u = (n: number) => n * scale;
  const frame = { display: "flex", flexDirection: "column" as const, width: "100%", height: "100%", background: C.paper, fontFamily: "Quiz Serif", color: C.ink };

  if (spec.kind === "cover") {
    return (
      <div style={{ ...frame, background: C.cream, padding: u(28) }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", flex: 1, border: `${u(2)}px solid ${C.gold}`, borderRadius: u(18), padding: `${u(56)}px ${u(40)}px`, background: C.paper }}>
          <div style={{ display: "flex", fontSize: u(22), letterSpacing: u(6), color: C.gray }}>2027 · 丁未年</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: u(260), lineHeight: 1, color: C.red }}>羊</div>
            <div style={{ display: "flex", fontSize: u(34), marginTop: u(28), textAlign: "center", justifyContent: "center" }}>The Year of the Fire Goat</div>
            <div style={{ display: "flex", fontSize: u(26), color: C.gold, marginTop: u(14) }}>{`${cap(animal.animal)} edition · ${animal.zh}`}</div>
          </div>
          <div style={{ display: "flex", fontSize: u(20), color: C.gray }}>Planner · Lucky guide · Art prints</div>
        </div>
      </div>
    );
  }

  if (spec.kind === "year") {
    const lucky = LUCKY[animal.animal];
    const matches = bestMatches(animal.animal).map((a) => ANIMAL_PROFILES.find((p) => p.animal === a)!);
    const text = animal.goatYear.replace(KIT_LINE, "").trim();
    const row = (label: string, value: string) => (
      <div style={{ display: "flex", justifyContent: "space-between", padding: `${u(14)}px 0`, borderBottom: `${u(1)}px solid ${C.line}`, fontSize: u(19) }}>
        <div style={{ display: "flex", color: C.gray }}>{label}</div>
        <div style={{ display: "flex", textAlign: "right" }}>{value}</div>
      </div>
    );
    return (
      <div style={{ ...frame, padding: `${u(48)}px ${u(44)}px` }}>
        <div style={{ display: "flex", fontSize: u(16), letterSpacing: u(4), color: C.gray }}>YOUR 2027</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: u(12) }}>
          <div style={{ display: "flex", fontSize: u(84), lineHeight: 1, color: C.red, flexShrink: 0 }}>{animal.zh}</div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: u(20), flexShrink: 1 }}>
            <div style={{ display: "flex", fontSize: u(30) }}>{`The ${cap(animal.animal)} in a Goat year`}</div>
            <div style={{ display: "flex", fontSize: u(18), color: C.gray, marginTop: u(4) }}>{`Lunar New Year: ${LNY_2027}`}</div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: u(19), lineHeight: 1.5, marginTop: u(28), flexShrink: 0 }}>{text}</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: u(30), padding: `${u(6)}px ${u(22)}px`, background: C.cream, borderRadius: u(14), flexShrink: 0 }}>
          {row("Lucky colors", lucky.colors.map(cap).join(", "))}
          {row("Lucky numbers", lucky.numbers.join(", "))}
          {row("Best matches", matches.map((m) => `${cap(m.animal)} ${m.zh}`).join(" · "))}
        </div>
        <div style={{ display: "flex", fontSize: u(14), color: C.gray, marginTop: u(16) }}>From traditional Chinese zodiac folklore. Sources vary.</div>
        <div style={{ display: "flex", fontSize: u(19), marginTop: u(30) }}>My intentions for 2027</div>
        <WritingLines u={u} count={4} color={C.line} />
      </div>
    );
  }

  if (spec.kind === "month") {
    const m = KIT_MONTHS[spec.index];
    const cells = kitCalendar(spec.index);
    const cellH = cells.length > 35 ? 50 : 58;
    return (
      <div style={{ ...frame, padding: `${u(44)}px ${u(40)}px` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", fontSize: u(34) }}>{`${m.month} 2027`}</div>
          <div style={{ display: "flex", fontSize: u(26), color: C.gray }}>{m.zh}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: u(26), padding: `${u(18)}px ${u(22)}px`, background: C.cream, borderRadius: u(14) }}>
          <div style={{ display: "flex", fontSize: u(92), lineHeight: 1, color: C.red }}>{m.char}</div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: u(22), flex: 1 }}>
            <div style={{ display: "flex", fontSize: u(15), letterSpacing: u(3), color: C.gray }}>CHARACTER OF THE MONTH</div>
            <div style={{ display: "flex", fontSize: u(26), marginTop: u(6) }}>{`${m.pinyin} · ${m.meaning}`}</div>
            <div style={{ display: "flex", fontSize: u(18), color: C.gray, marginTop: u(4) }}>{m.line}</div>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: u(22) }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} style={{ display: "flex", width: "14.2857%", justifyContent: "center", fontSize: u(14), color: C.gray, letterSpacing: u(2) }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: u(8), borderTop: `${u(1)}px solid ${C.line}`, borderLeft: `${u(1)}px solid ${C.line}` }}>
          {cells.map((d, i) => (
            <div key={i} style={{ display: "flex", width: "14.2857%", height: u(cellH), padding: u(6), fontSize: u(15), color: C.gray, borderRight: `${u(1)}px solid ${C.line}`, borderBottom: `${u(1)}px solid ${C.line}` }}>
              {d ?? ""}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: u(19), marginTop: u(24) }}>{m.prompt}</div>
        <WritingLines u={u} count={cells.length > 35 ? 4 : 5} color={C.line} />
      </div>
    );
  }

  const p = KIT_PRINTS[spec.index];
  return (
    <div style={{ ...frame, padding: u(30) }}>
      <div style={{ display: "flex", flex: 1, padding: u(10), border: `${u(3)}px solid ${C.gold}`, borderRadius: u(6) }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, border: `${u(1)}px solid ${C.gold}` }}>
          <div style={{ display: "flex", fontSize: u(380), lineHeight: 1, color: C.red }}>{p.char}</div>
          <div style={{ display: "flex", fontSize: u(26), color: C.gray, marginTop: u(30) }}>{`${p.pinyin} · ${p.meaning}`}</div>
        </div>
      </div>
    </div>
  );
}
