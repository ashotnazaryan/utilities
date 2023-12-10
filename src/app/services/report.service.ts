import { Injectable, inject } from '@angular/core';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { Amount, ReportDetails } from '@models';
import {
  getCurrentDate,
  getLastDateOfPreviousMonth,
  getFirstDateOfPreviousMonth,
  getDayOfCurrentMonth,
  getPreviousMonthShortName,
  getPreviousMonthLongName
} from '@utils';
import { FontService } from '@services';
import { CurrencyIso } from '@constants';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private pdfDoc?: PDFDocument;
  private fontService = inject(FontService);
  private readonly margin = 24;
  private readonly smallFont = 11;
  private readonly mediumFont = 12;
  private readonly largeFont = 13;

  async generateReport(details: ReportDetails & { amount: Amount }): Promise<void> {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontBytes = await this.fontService.loadUbuntuFont();
    const boldFontBytes = await this.fontService.loadUbuntuFont('bold');
    const font = await pdfDoc.embedFont(fontBytes);
    const boldFont = await pdfDoc.embedFont(boldFontBytes);
    const { amount, vatIncluded, sellerName, sellerAddress, sellerLocation, sellerVatID, sellerAccount, buyerName, buyerAddress, buyerLocation, buyerVatID } = details;
    const tableHeaderHeight = 50;
    this.pdfDoc = pdfDoc;

    // document dates
    page.drawText('Invoice No.', { x: this.margin, y: height - this.margin, font: boldFont, size: this.mediumFont });
    page.drawText(getFirstDateOfPreviousMonth(), { x: this.margin + 130, y: height - this.margin, font: font, size: this.mediumFont });

    page.drawText('Issue date:', { x: this.margin, y: height - this.margin - 20, font: boldFont, size: this.mediumFont });
    page.drawText(getCurrentDate(), { x: this.margin + 130, y: height - this.margin - 20, font: font, size: this.mediumFont });

    page.drawText('Sale date:', { x: this.margin, y: height - this.margin - 40, font: boldFont, size: this.mediumFont });
    page.drawText(getLastDateOfPreviousMonth(), { x: this.margin + 130, y: height - this.margin - 40, font: font, size: this.mediumFont });

    page.drawText('Due date:', { x: this.margin, y: height - this.margin - 60, font: boldFont, size: this.mediumFont });
    page.drawText(getDayOfCurrentMonth(14), { x: this.margin + 130, y: height - this.margin - 60, font: font, size: this.mediumFont });

    page.drawText('Payment type:', { x: this.margin, y: height - this.margin - 80, font: boldFont, size: this.mediumFont });
    page.drawText('Transfer', { x: this.margin + 130, y: height - this.margin - 80, font: font, size: this.mediumFont });

    // document content
    page.drawText('Seller:', { x: this.margin, y: height - this.margin - 120, font: boldFont, size: this.mediumFont });
    page.drawText('Buyer:', { x: width / 2 + this.margin, y: height - this.margin - 120, font: boldFont, size: this.mediumFont });

    page.drawText(sellerName, { x: this.margin, y: height - this.margin - 140, font: font, size: this.mediumFont });
    page.drawText(buyerName, { x: width / 2 + this.margin, y: height - this.margin - 140, font: font, size: this.mediumFont });

    page.drawText(sellerAddress, { x: this.margin, y: height - this.margin - 160, font: font, size: this.mediumFont });
    page.drawText(buyerAddress, { x: width / 2 + this.margin, y: height - this.margin - 160, font: font, size: this.mediumFont });

    page.drawText(sellerLocation, { x: this.margin, y: height - this.margin - 180, font: font, size: this.mediumFont });
    page.drawText(buyerLocation, { x: width / 2 + this.margin, y: height - this.margin - 180, font: font, size: this.mediumFont });

    page.drawText(`VAT ID ${sellerVatID}`, { x: this.margin, y: height - this.margin - 200, font: font, size: this.mediumFont });
    page.drawText(`VAT ID ${buyerVatID}`, { x: width / 2 + this.margin, y: height - this.margin - 200, font: font, size: this.mediumFont });

    page.drawText(sellerAccount, { x: this.margin, y: height - this.margin - 240, font: font, size: this.mediumFont });

    // table header
    page.drawRectangle({ x: this.margin, y: height - this.margin - 330, width: width - 2 * this.margin, height: tableHeaderHeight, color: rgb(0.7, 0.7, 0.7), borderColor: rgb(0, 0, 0), borderWidth: 1 });

    // table header cells
    page.drawText('No', { x: this.margin + 10, y: height - this.margin - 310, font: font, size: this.smallFont });
    page.drawText('Name', { x: this.margin + 40, y: height - this.margin - 310, font: font, size: this.smallFont });
    page.drawText('Unit', { x: this.margin + 155, y: height - this.margin - 310, font: font, size: this.smallFont });
    page.drawText('Qty', { x: this.margin + 185, y: height - this.margin - 310, font: font, size: this.smallFont });
    page.drawText('Unit net', { x: this.margin + 220, y: height - this.margin - 300, font: font, size: this.smallFont });
    page.drawText('price', { x: this.margin + 220, y: height - this.margin - 320, font: font, size: this.smallFont });
    page.drawText('Net value', { x: this.margin + 275, y: height - this.margin - 310, font: font, size: this.smallFont });
    page.drawText('VAT rate', { x: this.margin + 360, y: height - this.margin - 295, font: font, size: this.smallFont });
    page.drawText('%', { x: this.margin + 345, y: height - this.margin - 320, font: font, size: this.smallFont });
    page.drawText('Amount', { x: this.margin + 380, y: height - this.margin - 320, font: font, size: this.smallFont });
    page.drawText('Gross', { x: this.margin + 440, y: height - this.margin - 300, font: font, size: this.smallFont });
    page.drawText('value', { x: this.margin + 440, y: height - this.margin - 320, font: font, size: this.smallFont });
    page.drawText('Currency', { x: this.margin + 495, y: height - this.margin - 310, font: font, size: this.smallFont });

    // table body
    page.drawRectangle({ x: this.margin, y: height - this.margin - 330 - tableHeaderHeight, width: width - 2 * this.margin, height: tableHeaderHeight, borderColor: rgb(0, 0, 0), borderWidth: 1 });

    // table cell (header/body) borders
    page.drawLine({ start: { x: this.margin + 30, y: height - this.margin - 330 + tableHeaderHeight }, end: { x: this.margin + 30, y: height - this.margin - 330 - tableHeaderHeight }, thickness: 1 });
    page.drawLine({ start: { x: this.margin + 150, y: height - this.margin - 330 + tableHeaderHeight }, end: { x: this.margin + 150, y: height - this.margin - 330 - tableHeaderHeight }, thickness: 1 });
    page.drawLine({ start: { x: this.margin + 180, y: height - this.margin - 330 + tableHeaderHeight }, end: { x: this.margin + 180, y: height - this.margin - 330 - tableHeaderHeight }, thickness: 1 });
    page.drawLine({ start: { x: this.margin + 210, y: height - this.margin - 330 + tableHeaderHeight }, end: { x: this.margin + 210, y: height - this.margin - 330 - tableHeaderHeight }, thickness: 1 });
    page.drawLine({ start: { x: this.margin + 270, y: height - this.margin - 330 + tableHeaderHeight }, end: { x: this.margin + 270, y: height - this.margin - 330 - tableHeaderHeight }, thickness: 1 });
    page.drawLine({ start: { x: this.margin + 330, y: height - this.margin - 330 + tableHeaderHeight }, end: { x: this.margin + 330, y: height - this.margin - 330 - tableHeaderHeight }, thickness: 1 });
    page.drawLine({ start: { x: this.margin + 430, y: height - this.margin - 330 + tableHeaderHeight }, end: { x: this.margin + 430, y: height - this.margin - 330 - tableHeaderHeight }, thickness: 1 });
    page.drawLine({ start: { x: this.margin + 370, y: height - this.margin - 353 + tableHeaderHeight }, end: { x: this.margin + 370, y: height - this.margin - 330 - tableHeaderHeight }, thickness: 1 });
    page.drawLine({ start: { x: this.margin + 490, y: height - this.margin - 330 + tableHeaderHeight }, end: { x: this.margin + 490, y: height - this.margin - 330 - tableHeaderHeight }, thickness: 1 });
    // VAT rate bottom border
    page.drawLine({ start: { x: this.margin + 330, y: height - this.margin - 353 + tableHeaderHeight }, end: { x: this.margin + 430, y: height - this.margin - 353 + tableHeaderHeight }, thickness: 1 });

    // table body cells
    page.drawText('1', { x: this.margin + 10, y: height - this.margin - 350, font: font, size: this.smallFont });
    page.drawText('Programming services', { x: this.margin + 35, y: height - this.margin - 350, font: font, size: this.smallFont });
    page.drawText(`${getPreviousMonthLongName()}`, { x: this.margin + 35, y: height - this.margin - 370, font: font, size: this.smallFont });
    page.drawText('—', { x: this.margin + 160, y: height - this.margin - 350, font: font, size: this.smallFont });
    page.drawText('1', { x: this.margin + 190, y: height - this.margin - 350, font: font, size: this.smallFont });
    page.drawText(amount.net, { x: this.margin + 220, y: height - this.margin - 350, font: font, size: this.smallFont });
    page.drawText(amount.net, { x: this.margin + 280, y: height - this.margin - 350, font: font, size: this.smallFont });
    page.drawText(`${vatIncluded ? '23%' : 'zw'}`, { x: this.margin + 340, y: height - this.margin - 350, font: font, size: this.smallFont });
    page.drawText(`${vatIncluded ? amount.vat : '—'}`, { x: this.margin + 380, y: height - this.margin - 350, font: font, size: this.smallFont });
    page.drawText(`${vatIncluded ? amount.gross : amount.net}`, { x: this.margin + 440, y: height - this.margin - 350, font: font, size: this.smallFont });
    page.drawText(CurrencyIso.pln, { x: this.margin + 500, y: height - this.margin - 350, font: font, size: this.smallFont });

    // document total
    const totalText = `Total: ${amount.gross} ${CurrencyIso.pln}`;
    const totalTextWidth = font.widthOfTextAtSize(totalText, this.largeFont);
    page.drawText(totalText, { x: width - totalTextWidth - this.margin, y: height - this.margin - 410, font: boldFont, size: this.largeFont });

    // VAT exemption
    page.drawText(`${vatIncluded ? '' : 'Podstawa zwolnienia z VAT: Zwolnienie podmiotowe zg. z art. 113 ust. 1 i 9 ustawy o VAT.'}`, { x: this.margin, y: height - this.margin - 450, font: font, size: this.mediumFont });
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
    link.download = `Invoice_${getPreviousMonthShortName()}.pdf`;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(blobUrl);
  }
}
