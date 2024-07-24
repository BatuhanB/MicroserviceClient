import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IdentityService } from './identity-service';
import { Observable } from 'rxjs';
import { Response } from '../models/response';
import { BasketModel } from '../models/Basket/basketmodel';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private baseUrl = 'http://localhost:5000/services/basket/baskets';

  constructor(
    private httpClient: HttpClient,
    private identityService: IdentityService) { }

  get(): Observable<Response<BasketModel>> {
    const userId = this.identityService.getUserId();
    return this.httpClient.get<Response<BasketModel>>(`${this.baseUrl}/get`);
  }

  saveOrUpdate(basket: BasketModel): Observable<Response<boolean>> {
    return this.httpClient.post<Response<boolean>>(`${this.baseUrl}/saveorupdate`, basket);
  }

  delete(): Observable<Response<boolean>> {
    return this.httpClient.delete<Response<boolean>>(`${this.baseUrl}/delete`);
  }
}
