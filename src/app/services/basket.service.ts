import { CourseService } from './catalog/course.service';
import { IdentityService } from './identity-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, Observable, of, switchMap, throwError } from 'rxjs';
import { Response } from '../models/response';
import { BasketItemModel, BasketModel } from '../models/Basket/basketmodel';
import { BasketWithCourseModel } from '../models/Basket/basketwithcoursemodel';
import { CourseGetByIdModel } from '../models/Catalog/Course/CourseGetByIdModel';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private baseUrl = 'http://localhost:5000/services/basket/baskets';

  constructor(
    private httpClient: HttpClient,
    private identityService:IdentityService,
    private courseService:CourseService) { }

  get(): Observable<Response<BasketModel>> {
    return this.httpClient.get<Response<BasketModel>>(`${this.baseUrl}/get`).pipe(
      catchError((error)=>this.handleError(error))
    );
  }

  saveOrUpdate(basket: BasketModel): Observable<Response<boolean>> {
    return this.httpClient.post<Response<boolean>>(`${this.baseUrl}/saveorupdate`, basket).pipe(
      catchError(this.handleError)
    );
  }

  delete(): Observable<Response<boolean>> {
    return this.httpClient.delete<Response<boolean>>(`${this.baseUrl}/delete`);
  }

  addToBasket(basketItem: BasketItemModel): Observable<Response<boolean>> {
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
    );
  }


  removeFromBasket(basketItem: BasketItemModel): Observable<Response<boolean>> {
    return this.get().pipe(
      switchMap(res => {
        let basket: BasketModel = res.data;
        if (basket) {
          if(basket.basketItems.length == 1){
            basket.discountCode = '';
            basket.discountRate = null;
          }
          const deleteBasketItem = basket.basketItems.find(x => x.courseId === basketItem.courseId);
          if (deleteBasketItem) {
            basket.basketItems = basket.basketItems.filter(x => x.courseId !== basketItem.courseId);
          }
        }
        return this.saveOrUpdate(basket);
      })
    );
  }

  
  mapBasketItemsToCourses(basketWithCourses:BasketWithCourseModel[],basketItems: BasketItemModel[]) : BasketWithCourseModel[] {
    basketWithCourses = [];
    basketItems.forEach(item => {
      this.courseService.getById(item.courseId).subscribe({
        next: response => {
          if (response.isSuccessful) {
            this.mapCoursesToBasketCourseModel(basketWithCourses,response.data);
          } else {
            response.errors.forEach(err => console.error(err));
          }
        },
        error: err => console.error(err)
      });
      return item;
    });
    return basketWithCourses;
  }

  
  mapCoursesToBasketCourseModel(basketWithCourses:BasketWithCourseModel[],course: CourseGetByIdModel) {
    this.get().subscribe({
      next: response => {
        if (response.isSuccessful) {
          let basket = response.data.basketItems.find((val) => val.courseId == course.id);
          let basketWithCourseModel: BasketWithCourseModel = {
            categoryId: course.categoryId,
            createdDate: course.createdDate,
            description: course.description,
            feature: course.feature,
            id: course.id,
            image: course.image,
            name: course.name,
            price: course.price,
            priceWithDiscount: basket.priceWithDiscount,
            userId: course.userId
          }
          basketWithCourses.push(basketWithCourseModel);
        }
      }
    });
  }


  private handleError(error: HttpErrorResponse) : Observable<any> {
    let errorMessage = 'An unknown error occurred!';
    if (error.status === 404) {
      errorMessage = 'Resource not found';
      return EMPTY;
    } else {
      return of({ isSuccessful: false, message: errorMessage });
    }
  }
}
