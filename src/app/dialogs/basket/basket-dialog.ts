import { CouponModel } from './../../models/Basket/couponmodel';
import { AuthGuard } from './../../guards/auth.guard';
import { BasketService } from './../../services/basket.service';
import { IdentityService } from '../../services/identity-service';
import { Component, OnInit, Inject, } from '@angular/core';
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

@Component({
  selector: 'basket-dialog',
  templateUrl: 'basket-dialog.html',
  styles: `
  .basket-items {
    min-width:400px;
  }
  .basket-item{
    font-size:20px;
    margin-top:10px;
    border:1px rgba(0,0,0,.2) solid;
    margin-bottom:-20px;
    display:flex;
    justify-content:space-between;
  }
  .dialog-action-section{
    display:flex;
    margin:0 15px;
  }
  .apply-coupon-btn{
    margin-bottom: 40px;
    background-color: #0b9d3d;
    color: white;
  }
  .course-image{
    margin-right:20px;
  }
  .course-remove{
    display:flex;
    align-items:flex-end;
  }
  .course-content{
    color:black !important;
  }
  .dialog-total-price{
    display:flex;
    justify-content:flex-start;
    font-size:18px;
    height:5px;
  }
  .coupon-actions{
    margin:0 15px -35px 15px;
    justify-content: space-between;
  }
  .basket-item {
      padding: 10px;
      border-bottom: 1px solid #e0e0e0;
  }
  .basket-item:last-child {
      border-bottom: none;
  }
  .total-price {
      font-weight: bold;
      text-align: right;
      margin-top: 10px;
  }
  .dialog-title{
    display:flex;
    justify-content:center;
    font-size:25px;
    margin-bottom:-20px;
    font-weight:bold;
  }
  .dialog-top-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title-and-button {
      display: flex;
      align-items: center;
  }
  .mat-icon-button {
      border: none;
      background-color: #e7e7e7;
      border-radius: 35%;
      width: 40px;
      height: 40px;
      line-height: 1px;
      cursor: pointer;
      margin-left: 10px; /* Adjust this margin as needed */
  }
  .title-and-button span {
      font-size:18px;
      margin-left: 10px; /* Adjust this margin as needed */
  }
  `,
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
  coupon:CouponModel = new CouponModel();
  couponCode = new FormControl();
  couponCodeAppliedText:string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private courseService: CourseService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private identity: IdentityService,
    private basketService: BasketService,
  ) { 
    this.coupon.code = "7JFF6A0GKAF18H";
    this.coupon.rate = 20;
    this.coupon.isUsed = false;
  }

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
          this.mapBasketItemsToCourses(this.basket.basketItems);
        }
      }
    });
  }

  removeFromCart(course:CourseGetByIdModel) {
    let basketItem = this.basket.basketItems.find((value)=>value.courseId === course.id);
    this.basketService.removeFromBasket(basketItem)
      .subscribe({
        next: response => {
          if (response.isSuccessful) {
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

  applyDiscount(){
    let checkCouponExists = this.couponCode.value != this.basket.discountCode;
    if(checkCouponExists && !this.coupon.isUsed){
      this.coupon.isUsed = true;
      if(this.couponCode.value == this.coupon.code){
        this.basket.totalPrice = this.basket.totalPrice - ((this.basket.totalPrice * 20) / 100); 
        this.couponCodeAppliedText = `${this.couponCode.value} has applied!`;
        this.basket.discountCode = this.couponCode.value;
        this.couponCode.setValue('');

        this.basketService.saveOrUpdate(this.basket).subscribe({
          next:response=>{
            console.log(response.data);
          }
        })
      }else{
        this._snackBar.open(`Coupon code is not valid!`,'Okay',{
          duration:4000
        });
      }
    }else{
      this._snackBar.open(`Coupon code has already used!`,'Okay',{
        duration:4000
      });
    }
  }

  checkout() {

  }

  mapBasketItemsToCourses(basketItems: BasketItemModel[]) {
    basketItems.forEach((basketItem) => {
      this.courseService.getById(basketItem.courseId).subscribe({
        next: response => {
          if (response.isSuccessful) {
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