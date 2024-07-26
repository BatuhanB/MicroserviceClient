import { BasketService } from './../../services/basket.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IdentityService } from '../../services/identity-service';
import { MatDialog } from '@angular/material/dialog';
import { BasketDialog } from '../../dialogs/basket/basket-dialog';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  showBasket: boolean = false;
  isBasketEmpty: boolean = true;
  constructor(
    private identityService: IdentityService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private basketService: BasketService
  ) { }

  ngOnInit(): void {
    this.getAuthStatus();
  }

  private getAuthStatus() {
    this.basketService.get()
      .pipe(switchMap(res => {
        this.isBasketEmpty = res.data ? false : true;
        this.cdr.detectChanges();
        return this.identityService.getAuthStatus();
      }))
      .subscribe(isAuthenticated => {
        this.showBasket = isAuthenticated && !this.isBasketEmpty
        this.cdr.detectChanges();
      });
  }

  get isAuthenticated(): boolean {
    return this.identityService.isAuthenticated();
  }

  get userName(): string {
    return this.identityService.getUserName();
  }

  signOut() {
    this.identityService.logout();
  }

  openBasketDialog() {
    if (this.showBasket) {
      this.dialog.open(BasketDialog);
    }
  }

}
