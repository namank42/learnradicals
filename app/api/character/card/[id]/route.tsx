import { ImageResponse } from "next/og";
import { getResult } from "@/lib/character";
import { CARD_SIZES, ResultCard, ogFonts } from "@/lib/character/og";

/** Free 1080x1920 Story card for a result. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const view = getResult((await params).id);
  if (!view) return Response.json({ error: "Unknown result" }, { status: 404 });

  return new ImageResponse(<ResultCard view={view} format="story" />, {
    ...CARD_SIZES.story,
    fonts: await ogFonts(),
    headers: {
      "Content-Disposition": `attachment; filename="my-chinese-character-${view.character.slug}.png"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
