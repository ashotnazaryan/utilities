import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RateStore } from '../../store/report.store';
import { generatePDF } from '../../utils/pdf.utils';
import { ReportDetails } from '../../models/report';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  providers: [RateStore],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit {
  protected reportForm: FormGroup = new FormGroup({
    salary: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });
  readonly store = inject(RateStore);
  protected rate = this.store.rate;

  constructor() { }

  ngOnInit(): void {
    this.store.getExchangeRates();
    this.handleFormChanges();
  }

  async generate(): Promise<void> {
    const { amount, details } = this.store;

    await generatePDF({ amount: `${amount()} PLN`, ...details() });
  }

  private handleFormChanges(): void {
    this.reportForm.valueChanges
      .pipe(
        distinctUntilChanged()
      )
      .subscribe((value: ReportDetails) => {
        this.store.setDetails(value);
      });
  }
}
