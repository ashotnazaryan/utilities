import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ReportDetails } from '../models/report';

const PAGE_INDENT = 50;

const downloadFile = async (pdfDoc: PDFDocument): Promise<void> => {
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = blobUrl;
  link.download = 'invoice.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
};

export const generatePDF = async (details: ReportDetails & { amount: string }) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { height } = page.getSize();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  page.drawText(`Invoice for ${details.fullName}`, { x: PAGE_INDENT, y: height - 50, font: timesRomanFont, size: 40 });

  firstPage.drawText(`Total: ${details.amount}`, {
    x: PAGE_INDENT,
    y: height - 100,
    size: 25,
    font: timesRomanFont,
    color: rgb(0, 0, 0)
  });

  await downloadFile(pdfDoc);
};
