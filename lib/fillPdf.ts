import { readFileSync } from "fs";
import path from "path";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function fillUberIzjava(data: {
  fullName: string;
  oib: string;
}): Promise<Buffer> {
  const templatePath = path.join(process.cwd(), "public", "Uber Izjava.pdf");
  const templateBytes = readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pdfDoc.getPages()[0];
  const { height } = page.getSize();

  const today = new Date().toLocaleDateString("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Ime i prezime — on the underline after the label
  page.drawText(data.fullName, {
    x: 207,
    y: height - 256,
    size: 11,
    font,
    color: rgb(0, 0, 0),
  });

  // OIB — on the underline after the label
  page.drawText(data.oib, {
    x: 152,
    y: height - 307,
    size: 11,
    font,
    color: rgb(0, 0, 0),
  });

  // Grad i datum — "U ___ (grad, datum izjave)" at the bottom section
  // "Ugovor o radu sklopljen s agregatorom" is already pre-checked in the template
  page.drawText(`Zagreb, ${today}`, {
    x: 62,
    y: height - 611,
    size: 11,
    font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
