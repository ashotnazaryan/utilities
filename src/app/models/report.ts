import { CurrencyIso } from '@constants';

export interface ReportDetails {
  currency: CurrencyIso;
  salary: number;
  sellerName: string;
  sellerAddress: string;
  sellerLocation: string;
  sellerVatID: string;
  sellerAccount: string;
  buyerName: string;
  buyerAddress: string;
  buyerLocation: string;
  buyerVatID: string;
}

export interface ReportState {
  rate: number;
  details: ReportDetails;
}

export interface NBPResponse {
  code: CurrencyIso;
  rates: {
    effectiveDate: string;
    mid: number;
  }[];
}
