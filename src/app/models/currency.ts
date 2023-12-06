import { CurrencyIso } from "../constants/currencies";

export type CurrencySymbol = '$' | '€' | 'zł';

export interface Currency {
  iso: CurrencyIso;
  symbol: CurrencySymbol;
  name: string;
}
