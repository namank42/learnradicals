import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { getResult } from "@/lib/character";
import { getReadingAccess } from "@/lib/character/access";
import { CARD_SIZES, ResultCard, ogFonts } from "@/lib/character/og";

/** Paid wallpapers: ?session_id=…&v=1|2|3 (or ?preview=<id> outside production). */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const v = Number(q.get("v"));
  if (v !== 1 && v !== 2 && v !== 3) return Response.json({ error: "Bad variant" }, { status: 400 });

  const access = await getReadingAccess({ sessionId: q.get("session_id"), previewId: q.get("preview") });
  const view = access && getResult(access.resultId);
  if (!view) return Response.json({ error: "Not unlocked" }, { status: 403 });

  return new ImageResponse(<ResultCard view={view} format="wallpaper" variant={v} />, {
    ...CARD_SIZES.wallpaper,
    fonts: await ogFonts(),
    headers: {
      "Content-Disposition": `attachment; filename="${view.character.slug}-wallpaper-${v}.png"`,
      "Cache-Control": "private, max-age=86400",
    },
  });
}
