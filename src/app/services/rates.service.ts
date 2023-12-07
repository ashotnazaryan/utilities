import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { CurrencyIso } from '@constants';

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  constructor(private http: HttpClient) { }

  getExchangeRates(currency = CurrencyIso.usd): Promise<any> {
    return firstValueFrom(this.http.get(`http://api.nbp.pl/api/exchangerates/rates/A/${currency}`));
  }
}
