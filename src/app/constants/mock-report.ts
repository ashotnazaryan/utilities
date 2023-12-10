import { ReportDetails } from '@models';

export const REPORT_MOCK: Omit<ReportDetails, 'currency' | 'salary'> = {
  vatIncluded: false,
  sellerName: 'Ashot Nazaryan',
  sellerAddress: 'ul. Świderska 113B, lok. 39',
  sellerLocation: '03-128 Warszawa',
  sellerVatID: '5242978485',
  sellerAccount: '09 1600 1462 1738 5531 5000 0001',
  buyerName: 'ALLSTARSIT Poland sp z o.o.',
  buyerAddress: 'ZŁOTA 75A / 7',
  buyerLocation: '00-819 Warszawa, Poland',
  buyerVatID: '5272989631',
};
