import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  constructor(private http: HttpClient) { }

  getExchangeRates(): Promise<any> {
    return firstValueFrom(this.http.get('http://api.nbp.pl/api/exchangerates/rates/A/USD'));
  }
}
