import { switchMap } from 'rxjs';
import { NotificationService } from './../../services/notification.service';
import { Router } from '@angular/router';
import { BasketService } from './../../services/basket.service';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { IdentityService } from '../../services/identity-service';
import { MatDialog } from '@angular/material/dialog';
import { BasketDialog } from '../../dialogs/basket/basket-dialog';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationModel } from '../../models/Notifications/notificationmodel';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  notificationCount: number = 0;
  isBasketEmpty = signal(false);
  isAuth = signal(false);
  constructor(
    private identityService: IdentityService,
    private dialog: MatDialog,
    private basketService: BasketService,
    private router: Router,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.getAuthStatus();
    this.getNotifications();
  }

  redirectNotifications() {
    this.router.navigateByUrl("/notifications");
  }

  getNotifications() {
    const userId = this.identityService.getUserId();
    this.notificationService.getAllNotifications(userId).pipe(
      switchMap(response => {
        if (response) {
          if (response.isSuccessful) {
            this.getCount(response.data);
          }
        }
        return this.notificationService.getCountObservable();
      })
    )
      .subscribe({
        next: count => {
          this.notificationCount = count;
        }
      });
  }

  private getCount(notifications: NotificationModel[]) {
    this.notificationCount = notifications.filter(x => !x.status).length;
    this.notificationService.updateCount(this.notificationCount);
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
    } else {
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
