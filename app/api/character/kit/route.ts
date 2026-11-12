import type { NextRequest } from "next/server";
import { getResult } from "@/lib/character";
import { getReadingAccess } from "@/lib/character/access";
import { buildKitPdf } from "@/lib/character/kit-pdf";

export const maxDuration = 60;

/** The 2027 Goat-year kit PDF. Needs a paid session that included the kit (or ?preview=<id> outside production). */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const access = await getReadingAccess({
    sessionId: q.get("session_id"),
    previewId: q.get("preview"),
    previewKit: true,
  });
  const view = access && getResult(access.resultId);
  if (!access || !access.hasKit || !view) return Response.json({ error: "Kit not purchased" }, { status: 403 });

  const pdf = await buildKitPdf(view.animal);
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="2027-goat-year-kit-${view.animal.animal}.pdf"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
