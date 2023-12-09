import { Injectable, inject } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { ReportDetails } from '@models';
import {
  getCurrentDate,
  getLastDateOfPreviousMonth,
  getFirstDateOfPreviousMonth,
  getDayOfCurrentMonth,
  getPreviousMonthName
} from '@utils';
import { FontService } from '@services';

const MARGIN = 36;
const FONT_SIZE_MEDIUM = 14;
const FONT_SIZE_LARGE = 16;

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private pdfDoc?: PDFDocument;
  private fontService = inject(FontService);

  async generateReport(details: ReportDetails & { amount: string }): Promise<void> {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontBytes = await this.fontService.loadUbuntuFont();
    const boldFontBytes = await this.fontService.loadUbuntuFont('bold');
    const font = await pdfDoc.embedFont(fontBytes);
    const boldFont = await pdfDoc.embedFont(boldFontBytes);
    const { amount, sellerName, sellerAddress, sellerLocation, sellerVatID, sellerAccount, buyerName, buyerAddress, buyerLocation, buyerVatID } = details;
    this.pdfDoc = pdfDoc;

    page.drawText('Invoice No.', { x: MARGIN, y: height - MARGIN, font: boldFont, size: FONT_SIZE_MEDIUM });
    page.drawText(getFirstDateOfPreviousMonth(), { x: MARGIN + 130, y: height - MARGIN, font: font, size: FONT_SIZE_MEDIUM });

    page.drawText('Issue date:', { x: MARGIN, y: height - MARGIN - 20, font: boldFont, size: FONT_SIZE_MEDIUM });
    page.drawText(getCurrentDate(), { x: MARGIN + 130, y: height - MARGIN - 20, font: font, size: FONT_SIZE_MEDIUM });

    page.drawText('Sale date:', { x: MARGIN, y: height - MARGIN - 40, font: boldFont, size: FONT_SIZE_MEDIUM });
    page.drawText(getLastDateOfPreviousMonth(), { x: MARGIN + 130, y: height - MARGIN - 40, font: font, size: FONT_SIZE_MEDIUM });

    page.drawText('Due date:', { x: MARGIN, y: height - MARGIN - 60, font: boldFont, size: FONT_SIZE_MEDIUM });
    page.drawText(getDayOfCurrentMonth(14), { x: MARGIN + 130, y: height - MARGIN - 60, font: font, size: FONT_SIZE_MEDIUM });

    page.drawText('Payment type:', { x: MARGIN, y: height - MARGIN - 80, font: boldFont, size: FONT_SIZE_MEDIUM });
    page.drawText('Transfer', { x: MARGIN + 130, y: height - MARGIN - 80, font: font, size: FONT_SIZE_MEDIUM });

    page.drawText('Seller:', { x: MARGIN, y: height - MARGIN - 120, font: boldFont, size: FONT_SIZE_MEDIUM });
    page.drawText('Buyer:', { x: width / 2 + MARGIN, y: height - MARGIN - 120, font: boldFont, size: FONT_SIZE_MEDIUM });

    page.drawText(sellerName, { x: MARGIN, y: height - MARGIN - 140, font: font, size: FONT_SIZE_MEDIUM });
    page.drawText(buyerName, { x: width / 2 + MARGIN, y: height - MARGIN - 140, font: font, size: FONT_SIZE_MEDIUM });

    page.drawText(sellerAddress, { x: MARGIN, y: height - MARGIN - 160, font: font, size: FONT_SIZE_MEDIUM });
    page.drawText(buyerAddress, { x: width / 2 + MARGIN, y: height - MARGIN - 160, font: font, size: FONT_SIZE_MEDIUM });

    page.drawText(sellerLocation, { x: MARGIN, y: height - MARGIN - 180, font: font, size: FONT_SIZE_MEDIUM });
    page.drawText(buyerLocation, { x: width / 2 + MARGIN, y: height - MARGIN - 180, font: font, size: FONT_SIZE_MEDIUM });

    page.drawText(`VAT ID ${sellerVatID}`, { x: MARGIN, y: height - MARGIN - 200, font: font, size: FONT_SIZE_MEDIUM });
    page.drawText(`VAT ID ${buyerVatID}`, { x: width / 2 + MARGIN, y: height - MARGIN - 200, font: font, size: FONT_SIZE_MEDIUM });

    page.drawText(sellerAccount, { x: MARGIN, y: height - MARGIN - 240, font: font, size: FONT_SIZE_MEDIUM });

    const totalText = `Total: ${amount}`;
    const totalTextWidth = font.widthOfTextAtSize(totalText, FONT_SIZE_LARGE);
    page.drawText(totalText, { x: (width - totalTextWidth) / 2 - MARGIN, y: MARGIN, font: boldFont });
  }

  async getReportUrl(): Promise<string> {
    if (!this.pdfDoc) {
      return '';
    }
    const pdfBytes = await this.pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    return URL.createObjectURL(blob);
  }

  async downloadReport(): Promise<void> {
    const blobUrl = await this.getReportUrl();
    const link = document.createElement('a');

    link.href = blobUrl;
    link.download = `Invoice_${getPreviousMonthName()}.pdf`;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(blobUrl);
  }
}
