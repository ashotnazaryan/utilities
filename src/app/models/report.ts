import { CurrencyIso } from '../constants/currencies';

export interface ReportDetails {
  salary: number;
  fullName: string;
  currency: CurrencyIso;
}

export interface ReportState {
  rate: number;
  details: ReportDetails;
}
