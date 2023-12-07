import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RateStore } from '@store';
import { generatePDF } from '@utils';
import { ReportDetails } from '@models';
import { CurrencyIso } from '@constants';
import { ReportFormComponent } from '@components';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, ReportFormComponent],
  providers: [RateStore],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit {
  readonly store = inject(RateStore);
  rate = this.store.rate;

  constructor() { }

  ngOnInit(): void {
    this.store.getExchangeRates();
  }

  async handleFormSubmit(): Promise<void> {
    const { amount, details } = this.store;

    await generatePDF({ amount: `${amount()} ${CurrencyIso.pln}`, ...details() });
  }

  handleFormChanges(formValue: ReportDetails): void {
    const { details: { currency } } = this.store;

    if (currency() !== formValue.currency) {
      this.store.getExchangeRates(formValue.currency);
    }

    this.store.setDetails(formValue);
  }
}
