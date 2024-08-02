import { CourseService } from './catalog/course.service';
import { BasketItemModel } from './../models/Basket/basketmodel';
import { CreateOrderModel } from './../models/Order/createordermodel';
import { PaymentService } from './payment.service';
import { BasketService } from './basket.service';
import { PageRequest } from './../models/pagerequest';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap, forkJoin, from, map } from 'rxjs';
import { Response } from '../models/response';
import { OrderCreatedModel } from '../models/Order/ordercreatedmodel';
import { OrderListModel } from '../models/Order/orderlistmodel';
import { BasketModel } from '../models/Basket/basketmodel';
import { CheckoutModel, CheckoutModelAsync } from '../models/Order/checkoutmodel';
import { IdentityService } from './identity-service';
import { OrderItemsModel } from '../models/Order/orderitemsmodel';
import { PaymentCreatedModel } from '../models/Payment/paymentcreatedmodel';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:5000/services/order/orders';
  private imageBaseUrl = 'http://localhost:5020/photos/';

  constructor(
    private httpClient: HttpClient,
    private basketService: BasketService,
    private paymentService: PaymentService,
    private identityService: IdentityService,
    private courseService: CourseService
  ) { }

  create(checkOut: CheckoutModel, success: () => void): Observable<Response<OrderCreatedModel>> {
    return this.basketService.get().pipe(
      switchMap(basketRes => {
        if (basketRes.isSuccessful) {
          let basket = basketRes.data;
          let innerBasket = Object.assign(new BasketModel(), basket);
          checkOut.payment.totalPrice = innerBasket.getTotalPrice();

          return this.paymentService.receivePayment(checkOut.payment, () => { }).pipe(
            switchMap(paymentRes => {
              if (paymentRes.isSuccessful) {
                return this.mapBasketItemsToOrderItems(basket.basketItems).pipe(
                  switchMap(orderItems => {
                    let createOrderModel = new CreateOrderModel();
                    createOrderModel.buyerId = this.identityService.getUserId();
                    createOrderModel.address = checkOut.address;
                    createOrderModel.orderItems = orderItems;

                    return this.httpClient.post<Response<OrderCreatedModel>>(
                      `${this.baseUrl}/create`, createOrderModel
                    ).pipe(
                      catchError((error) => this.handleError(error, success))
                    );
                  })
                );
              } else {
                console.log("Payment is not successful");
                return of({ isSuccessful: false, message: 'Payment failed' });
              }
            })
          );
        } else {
          return of({ isSuccessful: false, message: 'Basket retrieval failed' });
        }
      })
    );
  }

  mapBasketItemsToOrderItems(basketItems: BasketItemModel[]): Observable<OrderItemsModel[]> {
    let orderItemsObservables = basketItems.map(basketItem => {
      let orderItem = new OrderItemsModel();
      let innerBasketItem = Object.assign(new BasketItemModel(), basketItem);
      orderItem.price = innerBasketItem.getPrice();
      orderItem.productId = innerBasketItem.courseId;
      orderItem.productName = innerBasketItem.courseName;

      return this.courseService.getById(innerBasketItem.courseId).pipe(
        map(res => {
          if (res.isSuccessful) {
            orderItem.imageUrl = `${this.imageBaseUrl}${res.data.image}`;
          }
          return orderItem;
        })
      );
    });

    return forkJoin(orderItemsObservables);
  }

  suspendCreate(checkOut: CheckoutModelAsync, success: () => void): Observable<Response<PaymentCreatedModel>> {
    return this.basketService.get().pipe(
      switchMap(basketRes => {
        if (basketRes.isSuccessful) {
          let basket = basketRes.data;
          let innerBasket = Object.assign(new BasketModel(), basket);
          checkOut.payment.totalPrice = innerBasket.getTotalPrice();
          return this.mapBasketItemsToOrderItems(innerBasket.basketItems).pipe(
            switchMap(orderItems => {
              checkOut.payment.order.buyerId = this.identityService.getUserId();
              checkOut.payment.order.address = checkOut.address;
              checkOut.payment.order.orderItems = orderItems;
              return this.paymentService.receivePaymentAsync(checkOut.payment, () => { });
            })
          )
        } else {
          return of({ isSuccessful: false, message: 'Basket retrieval failed' });
        }
      })
    );
  }

  getAll(request: PageRequest): Observable<Response<OrderListModel[]>> {
    let params = new HttpParams()
      .set('PageNumber', (request.pageNumber + 1).toString())
      .set('PageSize', request.pageSize.toString());
    return this.httpClient.get<Response<OrderListModel[]>>(`${this.baseUrl}/get`, { params: params });
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

