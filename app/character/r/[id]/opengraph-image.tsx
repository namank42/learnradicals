import { ImageResponse } from "next/og";
import { getResult } from "@/lib/character";
import { CARD_SIZES, ResultCard, ogFonts } from "@/lib/character/og";

export const alt = "My Chinese character";
export const size = CARD_SIZES.og;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const view = getResult((await params).id);
  if (!view) return new Response("Not found", { status: 404 });
  return new ImageResponse(<ResultCard view={view} format="og" />, { ...size, fonts: await ogFonts() });
}
