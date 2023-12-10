import { CurrencyIso } from '@constants';

export interface ReportDetails {
  currency: CurrencyIso;
  salary: number;
  vatIncluded: boolean;
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

export interface Amount {
  net: string;
  gross: string;
  vat: string;
}

export interface NBPResponse {
  code: CurrencyIso;
  rates: {
    effectiveDate: string;
    mid: number;
  }[];
}
