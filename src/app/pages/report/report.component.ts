import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RateStore } from '@store';
import { getLastDateOfPreviousMonth } from '@utils';
import { ReportDetails } from '@models';
import { CurrencyIso } from '@constants';
import { ReportService } from '@services';
import { ReportFormComponent, ReportPreviewComponent } from '@components';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, ReportFormComponent, ReportPreviewComponent],
  providers: [RateStore, ReportService],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit {
  private readonly store = inject(RateStore);
  private readonly lastDateOfPreviousMonth = getLastDateOfPreviousMonth();
  rate = this.store.rate;
  pdfUrl?: string;

  constructor(private reportService: ReportService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.getExchangeRates(this.lastDateOfPreviousMonth);
  }

  async handleFormSubmit(): Promise<void> {
    const { amount, details } = this.store;

    await this.reportService.generateReport({ amount: `${amount()} ${CurrencyIso.pln}`, ...details() });
    await this.reportService.downloadReport();
  }

  async handleFormChange(formValue: ReportDetails): Promise<void> {
    const { amount, details } = this.store;

    if (details.currency() !== formValue.currency) {
      this.store.getExchangeRates(this.lastDateOfPreviousMonth, formValue.currency);
    }

    this.store.setDetails(formValue);
    await this.reportService.generateReport({ amount: `${amount()} ${CurrencyIso.pln}`, ...details() });
    this.pdfUrl = await this.reportService.getReportUrl();
    this.cdRef.detectChanges();
  }
}
