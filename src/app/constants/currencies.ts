import { Currency } from '@models';

export enum CurrencyIso {
  usd = 'USD',
  eur = 'EUR',
  pln = 'PLN'
}

export const CURRENCIES: Currency[] = [
  {
    iso: CurrencyIso.usd,
    name: 'US Dollar',
    symbol: '$'
  },
  {
    iso: CurrencyIso.eur,
    name: 'Euro',
    symbol: '€'
  },
  {
    iso: CurrencyIso.pln,
    name: 'Polish Zloty',
    symbol: 'zł'
  },
];
