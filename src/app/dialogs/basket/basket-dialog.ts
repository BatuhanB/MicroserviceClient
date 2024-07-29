import { DiscountService } from './../../services/discount.service';
import { BasketService } from './../../services/basket.service';
import { IdentityService } from '../../services/identity-service';
import { Component, OnInit, Inject} from '@angular/core';
import {
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialog
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../services/catalog/course.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BasketItemModel, BasketModel } from '../../models/Basket/basketmodel';
import { CourseGetByIdModel } from '../../models/Catalog/Course/CourseGetByIdModel';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PhotoHelperPipe } from '../../pipes/photo-helper.pipe';
import { DurationFormatterPipe } from '../../pipes/duration-formatter-notst.pipe';
import { DiscountGetByCode } from '../../models/Discount/discountgetbycode';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'basket-dialog',
  templateUrl: 'basket-dialog.html',
  styleUrl: 'basket-dialog.css',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    CommonModule,
    MatIcon,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    PhotoHelperPipe,
    DurationFormatterPipe,
    ReactiveFormsModule
  ],
})
export class BasketDialog implements OnInit {
  basket: BasketModel;
  courses: CourseGetByIdModel[] = [];
  discount: DiscountGetByCode;
  couponCode = new FormControl();
  couponCodeAppliedText: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private courseService: CourseService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private identity: IdentityService,
    private basketService: BasketService,
    private discountService: DiscountService,
  ) { }

  ngOnInit(): void {
    if (this.identity.isAuthenticated()) {
      this.get();
    }
  }

  get() {
    this.basketService.get().subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.basket = response.data;
          if (this.basket.discountCode != null) this.couponCode.setValue(this.basket.discountCode);
          this.mapBasketItemsToCourses(this.basket.basketItems);
        }
      }
    });
  }

  removeFromCart(course: CourseGetByIdModel) {
    let basketItem = this.basket.basketItems.find((value) => value.courseId === course.id);
    if (basketItem != null) {
      this.basketService.removeFromBasket(basketItem)
        .subscribe({
          next: response => {
            if (response.isSuccessful) {
              this.courses = this.courses.filter((value) => value.id !== basketItem.courseId);
              this.get();
              this._snackBar.open(`${basketItem.courseName} has removed!`, "Okay", {
                duration: 2000
              })
            } else {
              console.log("Error");
            }
          }
        })
    }
  }

  applyDiscount() {
    let checkCouponExists = this.couponCode.value == this.basket.discountCode;
    if (!checkCouponExists) {
      this.discountService
        .getById(this.couponCode.value, this.couponNotValidCallback.bind(this))
        .pipe(switchMap(discRes => {
          if (discRes.isSuccessful) {
            this.discount = discRes.data;
            this.applyDiscountCode(this.basket.basketItems);
            return this.basketService.saveOrUpdate(this.basket);
          } else {
            return of({ isSuccessful: false });
          }
        })).subscribe({
          next: saveRes => {
            if (saveRes.isSuccessful) {
              this._snackBar.open(`Coupon code has applied!`, 'Okay', {
                duration: 4000
              });
              this.get();
            }
          }
        })
    } else {
      this._snackBar.open(`Coupon code has already used!`, 'Okay', {
        duration: 4000
      });
    }
  }

  couponNotValidCallback() {
    this._snackBar.open(`Coupon code is not valid!`, 'Okay', {
      duration: 4000
    });
  }

  applyDiscountCode(basketItems: BasketItemModel[]) {
    if (this.discount.code == this.couponCode.value &&
      this.discount.userId == this.basket.userId) {
      basketItems.map((value) => value.price = (value.price - (value.price * this.discount.rate) / 100));
      this.basket.discountCode = this.couponCode.value;
      this.basket.discountRate = this.discount.rate;
      this.mapBasketItemsToCourses(basketItems);
    }
  }

  removeDiscountCode(basketItems: BasketItemModel[]) {
    if (this.discount.code == this.couponCode.value &&
      this.discount.userId == this.basket.userId) {
      basketItems.map((value) => value.price = (value.price - (value.price * this.discount.rate) / 100));
      this.basket.discountCode = this.couponCode.value;
      this.mapBasketItemsToCourses(basketItems);
    }
  }

  checkout() {

  }

  mapBasketItemsToCourses(basketItems: BasketItemModel[]) {
    this.courses = [];
    basketItems.forEach((basketItem) => {
      this.courseService.getById(basketItem.courseId).subscribe({
        next: response => {
          if (response.isSuccessful) {
            response.data.price = basketItem.price;
            this.courses.push(response.data);
          } else {
            response.errors.forEach(err => {
              console.log(err);
            })
          }
        }, error: errs => {
          console.error(errs);
        }
      })
    });
  }
}