import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CurrencyIso } from '@constants';
import { NBPResponse } from '@models';

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  constructor(private http: HttpClient) { }

  getExchangeRates(date: string, currency = CurrencyIso.usd): Promise<NBPResponse> {
    return firstValueFrom(this.http.get<NBPResponse>(`https://api.nbp.pl/api/exchangerates/rates/A/${currency}/${date}`));
  }
}
