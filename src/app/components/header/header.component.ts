import { BasketService } from './../../services/basket.service';
import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../services/identity-service';
import { MatDialog } from '@angular/material/dialog';
import { BasketDialog } from '../../dialogs/basket/basket-dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isAuth: boolean = false;
  isBasketEmpty: boolean = false;
  constructor(
    private identityService: IdentityService,
    private dialog: MatDialog,
    private basketService: BasketService
  ) { }

  ngOnInit(): void {
    this.getAuthStatus();
  }

  private getAuthStatus() {
    this.identityService.getAuthStatus()
      .subscribe(isAuthenticated => {
        this.isAuth = isAuthenticated;
      });

      if(this.isAuth){
        this.basketService.get()
        .subscribe(res => {
          this.isBasketEmpty = (res.data && !this.isAuth) ? false : true;
        });
      }
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
    if (this.isBasketEmpty) {
      this.dialog.open(BasketDialog);
    }
  }

}
