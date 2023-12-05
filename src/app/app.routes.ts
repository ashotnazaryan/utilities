import { Routes } from '@angular/router';
import { ReportComponent } from './pages/report/report.component';

export const routes: Routes = [
  { path: '', redirectTo: '/report', pathMatch: 'full' },
  { path: 'report', component: ReportComponent }
];
