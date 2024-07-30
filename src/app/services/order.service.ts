import { CourseService } from './catalog/course.service';
import { BasketItemModel } from './../models/Basket/basketmodel';
import { CreateOrderModel } from './../models/Order/createordermodel';
import { PaymentService } from './payment.service';
import { BasketService } from './basket.service';
import { PageRequest } from './../models/pagerequest';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { Response } from '../models/response';
import { OrderCreatedModel } from '../models/Order/ordercreatedmodel';
import { OrderListModel } from '../models/Order/orderlistmodel';
import { BasketModel } from '../models/Basket/basketmodel';
import { CheckoutModel } from '../models/Order/checkoutmodel';
import { PaymentModel } from '../models/Payment/paymentmodel';
import { AdressModel } from '../models/Order/adressmodel';
import { IdentityService } from './identity-service';
import { OrderItemsModel } from '../models/Order/orderitemsmodel';

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
    return this.basketService.get().pipe(switchMap(basketRes => {
      let basket: BasketModel;
      if (basketRes.isSuccessful) {
        basket = basketRes.data;
        let innerBasket = Object.assign(new BasketModel(), basket);
        checkOut.payment.totalPrice = innerBasket.getTotalPrice();
      }
      return this.paymentService.receivePayment(checkOut.payment, () => { }).pipe(switchMap(paymentRes => {
        let createOrderModel: CreateOrderModel;
        if (paymentRes.isSuccessful) {
          createOrderModel.buyerId = this.identityService.getUserId();
          createOrderModel.adress = checkOut.adress;
          createOrderModel.orderItems = this.mapBasketItemsToOrderItems(basket.basketItems);
        } else {
          console.log("Payment is not successfull");
        }
        return this.httpClient.post<Response<OrderCreatedModel>>(`${this.baseUrl}/create`, createOrderModel).pipe(
          catchError((error) => this.handleError(error, success))
        );
      }))
    }));
  }

  suspend(order: CreateOrderModel, success: () => void): Observable<Response<OrderCreatedModel>> {
    return this.httpClient.post<Response<OrderCreatedModel>>(`${this.baseUrl}/create`, order).pipe(
      catchError((error) => this.handleError(error, success))
    );
  }

  getAll(request: PageRequest): Observable<Response<OrderListModel[]>> {
    let params = new HttpParams()
      .set('PageNumber', (request.pageNumber + 1).toString())
      .set('PageSize', request.pageSize.toString());
    return this.httpClient.get<Response<OrderListModel[]>>(`${this.baseUrl}/get`, {
      params: params
    })
  }

  mapBasketItemsToOrderItems(basketItems: BasketItemModel[]): OrderItemsModel[] {
    let orderItems: OrderItemsModel[] = [];
    basketItems.forEach(basketItem => {
      let orderItem: OrderItemsModel;
      let innerBasketItem = Object.assign(new BasketItemModel(), basketItem);
      orderItem.price = innerBasketItem.getPrice();
      orderItem.productId = innerBasketItem.courseId;
      orderItem.productName = innerBasketItem.courseName;
      this.courseService.getById(innerBasketItem.courseId).subscribe({ next: res => orderItem.imageUrl = `${this.imageBaseUrl}${res.data.image}` });
      orderItems.push(orderItem);
    })
    return orderItems;
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
