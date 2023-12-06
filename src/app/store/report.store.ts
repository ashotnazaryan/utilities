import { computed, inject } from '@angular/core';
import { signalStore, patchState, withComputed, withMethods, withState } from '@ngrx/signals';
import { calculateSalary } from '../utils/report.utils';
import { RatesService } from '../services/rates.service';
import { ReportDetails, ReportState } from '../models/report';
import { CURRENCIES, CurrencyIso } from '../constants/currencies';

const initialState: ReportState = {
  rate: 0,
  details: { salary: 0, fullName: 'Anonymus', currency: CURRENCIES[0].iso }
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
      getExchangeRates: async (currency = CurrencyIso.usd): Promise<void> => {
        let rate: number;
        if (currency === 'PLN') {
          rate = 1;
        } else {
          const { rates } = await ratesService.getExchangeRates(currency);
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
