// Server-only: assembles the 20-page 2027 Goat-year kit PDF for one animal.
import { ImageResponse } from "next/og";
import { PDFDocument } from "pdf-lib";
import { KIT_BASE, KIT_PAGES, KitPage } from "./kit-pages";
import { ogFonts } from "./og";
import type { AnimalProfile } from "./types";

const PRINT_SCALE = 2; // 1240x1754 px, about 150 dpi on A4
const A4_PT = { width: 595.28, height: 841.89 };

export async function buildKitPdf(animal: AnimalProfile): Promise<Uint8Array> {
  const fonts = await ogFonts();
  const pngs = await Promise.all(
    KIT_PAGES.map(async (spec) => {
      const res = new ImageResponse(<KitPage spec={spec} animal={animal} scale={PRINT_SCALE} />, {
        width: KIT_BASE.width * PRINT_SCALE,
        height: KIT_BASE.height * PRINT_SCALE,
        fonts,
      });
      return new Uint8Array(await res.arrayBuffer());
    }),
  );

  const doc = await PDFDocument.create();
  doc.setTitle(`2027 Year of the Fire Goat — ${animal.animal} edition`);
  doc.setAuthor("Learn Radicals");
  for (const png of pngs) {
    const img = await doc.embedPng(png);
    const page = doc.addPage([A4_PT.width, A4_PT.height]);
    page.drawImage(img, { x: 0, y: 0, width: A4_PT.width, height: A4_PT.height });
  }
  return doc.save();
}
