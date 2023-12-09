import { computed, inject } from '@angular/core';
import { signalStore, patchState, withComputed, withMethods, withState } from '@ngrx/signals';
import { calculateSalary } from '@utils';
import { RatesService } from '@services';
import { ReportDetails, ReportState } from '@models';
import { CURRENCIES, CurrencyIso } from '@constants';

const initialState: ReportState = {
  rate: 0,
  details: {
    salary: 0,
    currency: CURRENCIES[0].iso,
    sellerName: '',
    sellerAddress: '',
    sellerLocation: '',
    sellerVatID: '',
    sellerAccount: '',
    buyerName: '',
    buyerAddress: '',
    buyerLocation: '',
    buyerVatID: ''
  }
};

export const RateStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ rate, details }) => {
    return {
      amount: computed(() => calculateSalary(rate(), details().salary)),
    }
  }),
  withMethods((state) => {
    const ratesService = inject(RatesService);

    return {
      getExchangeRates: async (date: string, currency = CurrencyIso.usd): Promise<void> => {
        let rate: number;
        if (currency === 'PLN') {
          rate = 1;
        } else {
          const { rates } = await ratesService.getExchangeRates(date, currency);
          rate = rates[0].mid;
        }

        patchState(state, { rate });
      },
      setDetails: (details: ReportDetails): void => {
        patchState(state, { details });
      }
    };
  })
);
