// Server-only: preview pages of the (pre-order) 2027 Goat-year kit, rendered with next/og.
import type { AnimalProfile } from "./types";

const C = { paper: "#faf8f4", cream: "#f3efe8", ink: "#1a1a1a", red: "#cc3425", gold: "#b8860b", gray: "#6b6560", line: "#e4ddd0" };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const KIT_PAGE_SIZE = { width: 620, height: 877 }; // A-series ratio

export function KitPage({ page, animal }: { page: 1 | 2 | 3; animal: AnimalProfile }) {
  const frame = {
    display: "flex",
    flexDirection: "column" as const,
    width: "100%",
    height: "100%",
    background: C.paper,
    fontFamily: "Quiz Serif",
    color: C.ink,
  };

  if (page === 1) {
    return (
      <div style={{ ...frame, background: C.cream, padding: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", flex: 1, border: `2px solid ${C.gold}`, borderRadius: 18, padding: "56px 40px", background: C.paper }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: C.gray }}>2027 · 丁未年</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 260, lineHeight: 1, color: C.red }}>羊</div>
            <div style={{ display: "flex", fontSize: 34, marginTop: 28, textAlign: "center", justifyContent: "center" }}>The Year of the Fire Goat</div>
            <div style={{ display: "flex", fontSize: 26, color: C.gold, marginTop: 14 }}>{`${cap(animal.animal)} edition · ${animal.zh}`}</div>
          </div>
          <div style={{ display: "flex", fontSize: 20, color: C.gray }}>Planner · Lucky guide · Art prints</div>
        </div>
      </div>
    );
  }

  if (page === 2) {
    // January 2027 starts on a Friday (weeks start Sunday).
    const cells = [...Array(5).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)];
    while (cells.length % 7) cells.push(null);
    return (
      <div style={{ ...frame, padding: "44px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", fontSize: 34 }}>January 2027</div>
          <div style={{ display: "flex", fontSize: 26, color: C.gray }}>一月</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 26, padding: "18px 22px", background: C.cream, borderRadius: 14 }}>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 1, color: C.red }}>新</div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 22 }}>
            <div style={{ display: "flex", fontSize: 16, letterSpacing: 3, color: C.gray }}>CHARACTER OF THE MONTH</div>
            <div style={{ display: "flex", fontSize: 26, marginTop: 6 }}>xīn · new</div>
            <div style={{ display: "flex", fontSize: 19, color: C.gray, marginTop: 4 }}>Begin again, on purpose.</div>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 22 }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} style={{ display: "flex", width: "14.2857%", justifyContent: "center", fontSize: 14, color: C.gray, letterSpacing: 2 }}>
              {d}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 8, borderTop: `1px solid ${C.line}`, borderLeft: `1px solid ${C.line}` }}>
          {cells.map((d, i) => (
            <div key={i} style={{ display: "flex", width: "14.2857%", height: 58, padding: 6, fontSize: 15, color: C.gray, borderRight: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
              {d ?? ""}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 19, marginTop: 24 }}>This month, I want to begin...</div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: "flex", height: 1, background: C.line, marginTop: 30 }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ ...frame, padding: 30 }}>
      <div style={{ display: "flex", flex: 1, padding: 10, border: `3px solid ${C.gold}`, borderRadius: 6 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, border: `1px solid ${C.gold}` }}>
          <div style={{ display: "flex", fontSize: 380, lineHeight: 1, color: C.red }}>福</div>
          <div style={{ display: "flex", fontSize: 26, color: C.gray, marginTop: 30 }}>fú · good fortune</div>
        </div>
      </div>
    </div>
  );
}
