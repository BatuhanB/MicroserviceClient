import { IdentityService } from './identity-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, Observable, of, switchMap, throwError } from 'rxjs';
import { Response } from '../models/response';
import { BasketItemModel, BasketModel } from '../models/Basket/basketmodel';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private baseUrl = 'http://localhost:5000/services/basket/baskets';

  constructor(
    private httpClient: HttpClient,
    private identityService:IdentityService) { }

  get(): Observable<Response<BasketModel>> {
    return this.httpClient.get<Response<BasketModel>>(`${this.baseUrl}/get`).pipe(
      catchError(this.handleError)
    );
  }

  saveOrUpdate(basket: BasketModel): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/saveorupdate`, basket).pipe(
      catchError(this.handleError)
    );
  }

  delete(): Observable<Response<boolean>> {
    return this.httpClient.delete<Response<boolean>>(`${this.baseUrl}/delete`);
  }

  addToBasket(basketItem: BasketItemModel): Observable<boolean> {
    return this.get().pipe(
      switchMap(res => {
        let basket: BasketModel = res.data;
        
        if (basket) {
          if (!basket.basketItems.find(x => x.courseId === basketItem.courseId)) {
            basket.basketItems.push(basketItem);
          }
        } else {
          basket = new BasketModel();
          basket.userId = this.identityService.getUserId();
          basket.basketItems = [basketItem];
        }
        return this.saveOrUpdate(basket);
      }),
      catchError(this.handleError)
    );
  }

  removeFromBasket(basketItem: BasketItemModel): Observable<any> {
    return this.get().pipe(
      switchMap(res => {
        const basket: BasketModel = res.data;
        if (!basket) {
          return of(false);
        }

        const deleteBasketItem = basket.basketItems.find(x => x.courseId === basketItem.courseId);
        if (!deleteBasketItem) {
          return of(false);
        }
        basket.basketItems = basket.basketItems.filter(x => x.courseId !== basketItem.courseId);
        return this.saveOrUpdate(basket);
      })
    );
  }



  private handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      console.log('Resource not found');
      return EMPTY;
    } else {
      return throwError(() => new Error('An error occurred'));
    }
  }
}
