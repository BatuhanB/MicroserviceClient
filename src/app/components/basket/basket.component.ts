import { OrderService } from './../../services/order.service';
import { BasketItemModel, BasketModel } from '../../models/Basket/basketmodel';
import { BasketService } from './../../services/basket.service';
import { Component, Inject, OnInit } from '@angular/core';
import { IdentityService } from '../../services/identity-service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, of } from 'rxjs';
import { BasketWithCourseModel } from '../../models/Basket/basketwithcoursemodel';
import { CourseGetByIdModel } from '../../models/Catalog/Course/CourseGetByIdModel';
import { DiscountGetByCode } from '../../models/Discount/discountgetbycode';
import { CourseService } from '../../services/catalog/course.service';
import { DiscountService } from '../../services/discount.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit {

  basket: BasketModel;
  basketWithCourses: BasketWithCourseModel[] = [];
  discount: DiscountGetByCode;
  couponCode = new FormControl();
  couponCodeAppliedText: string = '';

  constructor(
    private courseService: CourseService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private identity: IdentityService,
    private basketService: BasketService,
    private discountService: DiscountService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.couponCodeAppliedText = "% discount has applied.";
    if (this.identity.isAuthenticated()) {
      this.loadBasket();
    }
  }

  loadBasket() {
    this.basketService.get().subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.basket = response.data;
          if (this.basket.discountCode) this.couponCode.setValue(this.basket.discountCode);
          this.mapBasketItemsToCourses(this.basket.basketItems);
        }
      }
    });
  }

  removeFromBasket(course: CourseGetByIdModel) {
    const basketItem = this.basket.basketItems.find(item => item.courseId === course.id);
    if (basketItem) {
      this.basketService.removeFromBasket(basketItem).subscribe({
        next: response => {
          if (response.isSuccessful) {
            this.basketWithCourses = this.basketWithCourses.filter(item => item.id !== basketItem.courseId);
            this.loadBasket();
            this._snackBar.open(`${basketItem.courseName} has been removed!`, "Okay", { duration: 2000 });
          } else {
            console.error("Error removing item from basket");
          }
        }
      });
    }
  }

  applyDiscount() {
    if (this.couponCode.value !== this.basket.discountCode) {
      this.discountService
        .getById(this.couponCode.value, this.couponNotValidCallback.bind(this))
        .pipe(
          switchMap(discRes => {
            if (discRes.isSuccessful) {
              this.discount = discRes.data;
              this.applyDiscountCode(this.basket.basketItems);
              return this.basketService.saveOrUpdate(this.basket);
            } else {
              return of({ isSuccessful: false });
            }
          })
        ).subscribe({
          next: saveRes => {
            if (saveRes.isSuccessful) {
              this._snackBar.open(`Coupon code has been applied!`, 'Okay', { duration: 4000 });
              this.loadBasket();
            }
          }
        });
    } else {
      this._snackBar.open(`Coupon code has already been used!`, 'Okay', { duration: 4000 });
    }
  }

  removeDiscount() {
    if (this.basket.discountCode) {
      this.discountService
        .getById(this.basket.discountCode, this.couponNotValidCallback.bind(this))
        .pipe(
          switchMap(discRes => {
            if (discRes.isSuccessful) {
              this.discount = discRes.data;
              this.removeDiscountCode(this.basket.basketItems);
              return this.basketService.saveOrUpdate(this.basket);
            } else {
              return of({ isSuccessful: false });
            }
          })
        ).subscribe({
          next: saveRes => {
            if (saveRes.isSuccessful) {
              this._snackBar.open(`Coupon code has been removed!`, 'Okay', { duration: 4000 });
              this.loadBasket();
            }
          }
        });
    } else {
      this._snackBar.open(`There is no coupon code!`, 'Okay', { duration: 4000 });
    }
  }

  applyDiscountCode(basketItems: BasketItemModel[]) {
    if (this.discount.code === this.couponCode.value &&
      this.discount.userId === this.basket.userId) {
      this.updateBasketItemsWithDiscount(basketItems);
      this.basket.discountCode = this.couponCode.value;
      this.basket.discountRate = this.discount.rate;
    }
  }

  removeDiscountCode(basketItems: BasketItemModel[]) {
    if (this.discount.code && this.discount.userId === this.basket.userId) {
      this.updateBasketItemsWithoutDiscount(basketItems);
    }
  }

  mapBasketItemsToCourses(basketItems: BasketItemModel[]) {
    this.basketWithCourses = [];
    basketItems.forEach(item => {
      this.courseService.getById(item.courseId).subscribe({
        next: response => {
          if (response.isSuccessful) {
            this.mapCoursesToBasketCourseModel(response.data);
          } else {
            response.errors.forEach(err => console.error(err));
          }
        },
        error: err => console.error(err)
      });
      return item;
    });

  }

  updateBasketItemsWithDiscount(basketItems: BasketItemModel[]) {
    basketItems = basketItems.map(basketItem => {
      basketItem.priceWithDiscount = basketItem.price - (basketItem.price * this.discount.rate) / 100;
      return basketItem;
    });
    this.basket.basketItems = basketItems;
  }

  updateBasketItemsWithoutDiscount(basketItems: BasketItemModel[]) {
    basketItems = basketItems.map(basketItem => {
      basketItem.priceWithDiscount = 0;
      return basketItem;
    });
    this.basket.discountCode = null;
    this.basket.discountRate = 0;
    this.couponCode.setValue('');
    this.basket.basketItems = basketItems;
  }

  mapCoursesToBasketCourseModel(course: CourseGetByIdModel) {
    this.basketService.get().subscribe({
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
          this.basketWithCourses.push(basketWithCourseModel);
        }
      }
    });
  }

  couponNotValidCallback() {
    this._snackBar.open(`Coupon code is not valid!`, 'Okay', { duration: 4000 });
  }

  checkout() {
    // this.orderService.create()
  }
}