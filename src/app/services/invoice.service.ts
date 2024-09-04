import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { InvoiceFile } from '../models/Invoice/invoiceFile';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  s
  private baseUrl = 'http://localhost:5000/services/invoice/invoices';

  constructor(
    private httpClient: HttpClient
  ) { }

  getInvoiceFileUrl(orderId: number, buyerId: string): Observable<Response<InvoiceFile>> {
    let params = new HttpParams()
      .set('OrderId', (orderId).toString())
      .set('BuyerId', buyerId);
    return this.httpClient.get<Response<InvoiceFile>>(`${this.baseUrl}/getfileurl`, { params: params }).pipe(
      catchError((error) => this.handleError(error, () => { })));
  }

  private handleError(error: HttpErrorResponse, callback: () => void): Observable<any> {
    let errorMessages:string[]=[];

    if(error.status === 404){
      error.error.errors.forEach(err => {
        errorMessages.push(err);
      });;
    }
    return of({ isSuccessful: false, message: errorMessages });
  }

}
