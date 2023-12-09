import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SafeUrlPipe } from '@pipes';

@Component({
  selector: 'app-report-preview',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './report-preview.component.html',
  styleUrl: './report-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportPreviewComponent {
  @Input() url?: string;
}
