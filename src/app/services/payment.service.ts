import { PaymentModel, PaymentModelAsync } from './../models/Payment/paymentmodel';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Response } from '../models/response';
import { PaymentCreatedModel } from '../models/Payment/paymentcreatedmodel';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:5000/services/fakepayment/fakepayment';

  constructor(
    private httpClient: HttpClient
  ) { }

  receivePayment(payment: PaymentModel, paymentSuccess: () => void): Observable<Response<PaymentCreatedModel>> {
    return this.httpClient.post<Response<PaymentModel>>(`${this.baseUrl}/receivepayment`, payment).pipe(
      catchError((error) => this.handleError(error, paymentSuccess))
    );
  }

  receivePaymentAsync(payment: PaymentModelAsync, paymentSuccess: () => void): Observable<Response<PaymentCreatedModel>> {
    return this.httpClient.post<Response<PaymentCreatedModel>>(`${this.baseUrl}/receivepayment`, payment).pipe(
      catchError((error) => this.handleError(error, paymentSuccess))
    );
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
