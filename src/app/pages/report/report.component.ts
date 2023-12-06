import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RateStore } from '../../store/report.store';
import { generatePDF } from '../../utils/pdf.utils';
import { ReportDetails } from '../../models/report';
import { Currency } from '../../models/currency';
import { CURRENCIES, CurrencyIso } from '../../constants/currencies';
import { ReportFormField } from '../../constants/form-fields';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule],
  providers: [RateStore],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit {
  readonly store = inject(RateStore);
  readonly currencies: Currency[] = CURRENCIES;
  readonly reportFormField = ReportFormField;

  reportForm: FormGroup = new FormGroup({
    [ReportFormField.salary]: new FormControl('', [Validators.required]),
    [ReportFormField.fullName]: new FormControl('', [Validators.required]),
    [ReportFormField.currency]: new FormControl(CURRENCIES[0].iso, [Validators.required])
  });
  rate = this.store.rate;

  constructor() { }

  ngOnInit(): void {
    this.store.getExchangeRates();
    this.handleFormChanges();
  }

  async generate(): Promise<void> {
    const { amount, details } = this.store;

    await generatePDF({ amount: `${amount()} ${CurrencyIso.pln}`, ...details() });
  }

  private handleFormChanges(): void {
    this.reportForm.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((formValue: ReportDetails) => {
        this.store.setDetails(formValue);
      });

    this.reportForm.get(ReportFormField.currency)?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((currency: CurrencyIso) => {
        this.store.getExchangeRates(currency);
      });
  }
}
