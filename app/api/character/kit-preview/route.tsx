import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { ANIMAL_PROFILES } from "@/lib/character/content/animals";
import { KIT_BASE, KIT_PAGES, KitPage, type KitPageSpec } from "@/lib/character/kit-pages";
import { ogFonts } from "@/lib/character/og";

// Public preview thumbnails of the kit: ?animal=rabbit&p=1|2|3 (cover, January, 福 print).
// Outside production, ?page=0..19 renders any kit page for checking.
const PREVIEW: Record<number, KitPageSpec> = {
  1: { kind: "cover" },
  2: { kind: "month", index: 0 },
  3: { kind: "print", index: 0 },
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const devPage = process.env.NODE_ENV !== "production" && q.get("page") !== null ? KIT_PAGES[Number(q.get("page"))] : undefined;
  const spec = devPage ?? PREVIEW[Number(q.get("p"))];
  const animal = ANIMAL_PROFILES.find((a) => a.animal === q.get("animal"));
  if (!animal || !spec) return Response.json({ error: "Bad request" }, { status: 400 });

  return new ImageResponse(<KitPage spec={spec} animal={animal} />, {
    ...KIT_BASE,
    fonts: await ogFonts(),
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
