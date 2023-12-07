import { CurrencyIso } from "@constants";

export type CurrencySymbol = '$' | '€' | 'zł';

export interface Currency {
  iso: CurrencyIso;
  symbol: CurrencySymbol;
  name: string;
}
