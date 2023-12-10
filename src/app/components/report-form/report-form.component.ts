import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReportFormField, CURRENCIES, REPORT_MOCK } from '@constants';
import { ReportDetails, Currency } from '@models';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatCheckboxModule],
  templateUrl: './report-form.component.html',
  styleUrl: './report-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportFormComponent implements OnInit {
  @Output() formChanged = new EventEmitter<ReportDetails>();
  @Output() formSubmitted = new EventEmitter<void>();

  readonly currencies: Currency[] = CURRENCIES;
  readonly reportFormField = ReportFormField;
  reportForm: FormGroup = new FormGroup({
    [ReportFormField.currency]: new FormControl(CURRENCIES[0].iso, [Validators.required]),
    [ReportFormField.salary]: new FormControl('', [Validators.required]),
    [ReportFormField.vatIncluded]: new FormControl(false, [Validators.required]),
    [ReportFormField.sellerName]: new FormControl('', [Validators.required]),
    [ReportFormField.sellerAddress]: new FormControl('', [Validators.required]),
    [ReportFormField.sellerLocation]: new FormControl('', [Validators.required]),
    [ReportFormField.sellerVatID]: new FormControl('', [Validators.required]),
    [ReportFormField.sellerAccount]: new FormControl('', [Validators.required]),
    [ReportFormField.buyerName]: new FormControl('', [Validators.required]),
    [ReportFormField.buyerAddress]: new FormControl('', [Validators.required]),
    [ReportFormField.buyerLocation]: new FormControl('', [Validators.required]),
    [ReportFormField.buyerVatID]: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.handleFormChanges();
    // TODO: remove
    if (isDevMode()) {
      this.reportForm.patchValue(REPORT_MOCK, { emitEvent: true });
    }
  }

  submit(): void {
    this.formSubmitted.emit();
  }

  private handleFormChanges(): void {
    this.reportForm.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe((formValue: ReportDetails) => {
        this.formChanged.emit(formValue);
      });
  }
}
