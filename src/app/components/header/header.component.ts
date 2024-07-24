import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IdentityService } from '../../services/identity-service';
import { MatDialog } from '@angular/material/dialog';
import { BasketDialog } from '../../dialogs/basket/basket-dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit{
  showBasket:boolean = false;
  constructor(
    private identityService: IdentityService,
    private dialog: MatDialog,
    private cdr:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.identityService.getAuthStatus().subscribe(isAuthenticated => {
      this.showBasket = isAuthenticated;
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
