import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { distinctUntilChanged } from 'rxjs/operators';
import { ReportFormField, CURRENCIES } from '@constants';
import { ReportDetails, Currency } from '@models';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule],
  templateUrl: './report-form.component.html',
  styleUrl: './report-form.component.scss'
})
export class ReportFormComponent implements OnInit {
  @Output() onFormChanges = new EventEmitter<ReportDetails>();
  @Output() onFormSubmit = new EventEmitter<void>();

  readonly currencies: Currency[] = CURRENCIES;
  readonly reportFormField = ReportFormField;
  reportForm: FormGroup = new FormGroup({
    [ReportFormField.salary]: new FormControl('', [Validators.required]),
    [ReportFormField.fullName]: new FormControl('', [Validators.required]),
    [ReportFormField.currency]: new FormControl(CURRENCIES[0].iso, [Validators.required])
  });

  ngOnInit(): void {
    this.handleFormChanges();
  }

  submit(): void {
    this.onFormSubmit.emit();
  }

  private handleFormChanges(): void {
    this.reportForm.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((formValue: ReportDetails) => {
        this.onFormChanges.emit(formValue);
      });
  }
}
