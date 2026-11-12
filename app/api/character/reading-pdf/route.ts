import type { NextRequest } from "next/server";
import { getResult } from "@/lib/character";
import { getReadingAccess } from "@/lib/character/access";
import { buildReadingPdf, readingPageImage } from "@/lib/character/reading-pdf";
import { buildReflection } from "@/lib/character/reflection";

export const maxDuration = 60;

/** The buyer's full reading as a PDF: ?session_id=… (or ?preview=<id>&a=3102 outside production). */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const access = await getReadingAccess({
    sessionId: q.get("session_id"),
    previewId: q.get("preview"),
    previewAnswers: q.get("a"),
  });
  const view = access && !access.example ? getResult(access.resultId) : null;
  if (!access || !view) return Response.json({ error: "Not unlocked" }, { status: 403 });

  const reflection = buildReflection(access.answers, view.character.char);
  // Outside production, ?page=1..5 returns that page as a PNG for checking the layout.
  if (process.env.NODE_ENV !== "production" && q.get("page")) {
    return readingPageImage(view, reflection, Number(q.get("page")));
  }

  const pdf = await buildReadingPdf(view, reflection);
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="my-chinese-character-${view.character.slug}.pdf"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
