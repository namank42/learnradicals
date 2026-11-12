import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { ANIMAL_PROFILES } from "@/lib/character/content/animals";
import { KIT_PAGE_SIZE, KitPage } from "@/lib/character/kit-preview";
import { ogFonts } from "@/lib/character/og";

/** Public preview pages of the 2027 Goat-year kit: ?animal=rabbit&p=1|2|3 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const p = Number(q.get("p"));
  const animal = ANIMAL_PROFILES.find((a) => a.animal === q.get("animal"));
  if (!animal || (p !== 1 && p !== 2 && p !== 3)) return Response.json({ error: "Bad request" }, { status: 400 });

  return new ImageResponse(<KitPage page={p} animal={animal} />, {
    ...KIT_PAGE_SIZE,
    fonts: await ogFonts(),
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
