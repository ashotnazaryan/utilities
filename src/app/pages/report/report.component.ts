import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RateStore } from '@store';
import { getLastDateOfPreviousMonth } from '@utils';
import { ReportDetails } from '@models';
import { CurrencyIso } from '@constants';
import { PdfService } from '@services';
import { ReportFormComponent } from '@components';
import { SafeUrlPipe } from '@pipes';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe, ReportFormComponent],
  providers: [RateStore, PdfService],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit {
  private readonly store = inject(RateStore);
  private readonly lastDateOfPreviousMonth = getLastDateOfPreviousMonth();
  rate = this.store.rate;
  pdfUrl?: string;

  constructor(private pdfService: PdfService) { }

  ngOnInit(): void {
    this.store.getExchangeRates(this.lastDateOfPreviousMonth);
  }

  async handleFormPreview(): Promise<void> {
    const { amount, details } = this.store;

    await this.pdfService.generateReport({ amount: `${amount()} ${CurrencyIso.pln}`, ...details() });
    this.pdfUrl = await this.pdfService.getReportUrl();
  }

  async handleFormSubmit(): Promise<void> {
    const { amount, details } = this.store;

    await this.pdfService.generateReport({ amount: `${amount()} ${CurrencyIso.pln}`, ...details() });
    await this.pdfService.downloadReport();
  }

  handleFormChange(formValue: ReportDetails): void {
    const { details: { currency } } = this.store;

    if (currency() !== formValue.currency) {
      this.store.getExchangeRates(this.lastDateOfPreviousMonth, formValue.currency);
    }

    this.store.setDetails(formValue);
  }
}
