import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, of, throwError } from 'rxjs';
import { Response } from '../models/response';
import { DiscountGetByCode } from '../models/Discount/discountgetbycode';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private baseUrl = 'http://localhost:5000/services/discount/discount';

  constructor(
    private httpClient: HttpClient
  ) { }

  getById(code: string, callback: () => void): Observable<Response<DiscountGetByCode>> {
    return this.httpClient.get<Response<DiscountGetByCode>>(`${this.baseUrl}/getbycode/${code}`).pipe(
      catchError((error) => this.handleError(error, callback))
    );;
  }

  private handleError(error: HttpErrorResponse, callback: () => void): Observable<any> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    } else {
      callback();
      errorMessage = `Backend returned code ${error.status}, body was: ${error.error}`;
    }
    return of({ isSuccessful: false, message: errorMessage });
  }

}
