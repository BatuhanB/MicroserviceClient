import { BasketService } from './../../services/basket.service';
import { Component, OnInit, signal } from '@angular/core';
import { IdentityService } from '../../services/identity-service';
import { MatDialog } from '@angular/material/dialog';
import { BasketDialog } from '../../dialogs/basket/basket-dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isBasketEmpty = signal(false);
  isAuth = signal(false);
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
        this.isAuth.set(isAuthenticated);
        
        this.getBasket(this.isAuth());
      });
      
  }

  private getBasket(isAuthenticated: boolean) {
    if (isAuthenticated) {
      this.basketService.get()
        .subscribe(res => {
          this.isBasketEmpty.set(((res.data && !isAuthenticated) ? false : true));
        });
    }else{
      this.isBasketEmpty.set(false);
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
