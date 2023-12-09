import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FontService {
  constructor(private http: HttpClient) { }

  loadUbuntuFont(type: 'regular' | 'bold' = 'regular'): Promise<ArrayBuffer> {
    return firstValueFrom(this.http.get(`assets/fonts/${type === 'regular' ? 'Ubuntu-R' : 'Ubuntu-B'}.ttf`, { responseType: 'arraybuffer' }));
  }
}
