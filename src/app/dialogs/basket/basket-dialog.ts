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
import { BasketModel } from '../../models/Basket/basketmodel';

@Component({
  selector: 'basket-dialog',
  templateUrl: 'basket-dialog.html',
  styles: `
  .dialog-title{
    height:45px;
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
export class BasketDialog implements OnInit{
  basket:BasketModel = new BasketModel();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private courseService: CourseService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private identity:IdentityService,
    private basketService:BasketService,
    private guard:AuthGuard
  ) { }

  ngOnInit(): void {
    var isAuthenticated = this.guard.canActivate();
    if(isAuthenticated){
      this.get();
    }
  }
  
  get(){
    this.basketService.get().subscribe({
      next:response=>{
        if(response.isSuccessful){
          this.basket = response.data;
        }
      }
    });
  }
}