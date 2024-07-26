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

@Component({
  selector: 'basket-dialog',
  templateUrl: 'basket-dialog.html',
  styles: `
  .basket-items {
    min-width:400px;
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;
    display:flex;
    justify-content:center;
    font-size:20px;
    padding-top:20px;
    border:1px rgba(0,0,0,.2) solid;
  }
  .dialog-total-price{
    display:flex;
    justify-content:flex-end;
    font-size:18px;
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
  ],
})
export class BasketDialog implements OnInit {
  basket: BasketModel;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private courseService: CourseService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private identity: IdentityService,
    private basketService: BasketService,
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
        }
      }
    });
  }


  removeFromCart(basketItem: BasketItemModel) {
    this.basketService.removeFromBasket(basketItem)
      .subscribe({
        next: response => {
          if (response.isSuccessful) {
            this.get();
            this._snackBar.open(`${basketItem.courseName} has removed!`, "Okay", {
              duration: 2000
            })
          }else{
            console.log("Error");
          }
        }
      })
  }

  checkout() {

  }
}