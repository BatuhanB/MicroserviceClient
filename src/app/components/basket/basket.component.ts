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
  ) { }

  ngOnInit(): void {
    this.couponCodeAppliedText = "% discount has applied.";
    console.log(this.couponCode.value);
    if (this.identity.isAuthenticated()) {
      this.loadBasket();
    }
  }

  loadBasket() {
    this.basketService.get().subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.basket = response.data;
          this.basket.discountCode ? this.couponCode.setValue(this.basket.discountCode) : this.couponCode.setValue('Aa78hdJsul34kLM');
          this.basketWithCourses = this.basketService.mapBasketItemsToCourses(this.basketWithCourses, this.basket.basketItems);
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


  couponNotValidCallback() {
    this._snackBar.open(`Coupon code is not valid!`, 'Okay', { duration: 4000 });
  }

  checkout() {
    // this.orderService.create()
  }
}