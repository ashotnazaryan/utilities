import { Amount } from '@models';

export const calculateAmount = (rate: number, salary: number, vatIncluded = false): Amount => {
  const amount = salary * rate;
  const vat = vatIncluded ? (amount * 23) / 100 : 0;

  return {
    vat: vat.toFixed(2),
    net: amount.toFixed(2),
    gross: (amount + vat).toFixed(2),
  };
};
