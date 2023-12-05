import { computed, inject } from '@angular/core';
import { signalStore, patchState, withComputed, withMethods, withState } from '@ngrx/signals';
import { calculateSalary } from '../utils/report.utils';
import { RatesService } from '../services/rates.service';
import { ReportDetails } from '../models/report';

export const RateStore = signalStore(
  withState({ rate: 0, details: { salary: 0, firstName: 'Anonymus', lastName: 'Anonymus' } }),
  withComputed(({ rate, details }) => {
    return {
      amount: computed(() => calculateSalary(rate(), details().salary)),
    }
  }),
  withMethods((state) => {
    const ratesService = inject(RatesService);

    return {
      getExchangeRates: async (): Promise<void> => {
        const { rates } = await ratesService.getExchangeRates();
        const rate = rates[0].mid;

        patchState(state, { rate });
      },
      setDetails: (details: ReportDetails): void => {
        patchState(state, { details });
      }
    };
  })
);
