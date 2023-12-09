import { ReportDetails } from '@models';

export const REPORT_MOCK: Omit<ReportDetails, 'currency' | 'salary'> = {
  sellerName: 'Ashot Nazaryan',
  sellerAddress: 'ul. Swiderska 113B, lok. 39',
  sellerLocation: '03-128 Warszawa',
  sellerVatID: '5242978485',
  sellerAccount: '09 1600 1462 1738 5531 5000 0001',
  buyerName: 'ALLSTARSIT Poland sp z o.o.',
  buyerAddress: 'ZLOTA 75A / 7',
  buyerLocation: '00-819 Warszawa, Poland',
  buyerVatID: 'VAT ID 5272989631',
};
