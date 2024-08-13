import { of } from 'rxjs';
import { NotificationModel } from '../../models/Notifications/notificationmodel';
import { IdentityService } from '../../services/identity-service';
import { NotificationService } from '../../services/notification.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  count: number = 0;
  notifications: NotificationModel[] = [];

  constructor(
    private notificationService: NotificationService,
    private identityService: IdentityService) {
  }

  ngOnInit(): void {
    this.getNotifications();
    this.notificationService.getNotificationObservable().subscribe((notification: NotificationModel | null) => {
      if (notification) {
        this.notifications.unshift(notification);
        this.getCount();
      }
    });
  }

  markAllAsRead() {
    const userId = this.identityService.getUserId();
    this.notifications = [];
    this.notificationService.markAllAsRead(userId).subscribe({
      next: response => {
        if (!response.isSuccessful) {
          response.errors.forEach(err => {
            console.error(err);
          })
        }
      }
    })
    this.getCount();
  }

  private getCount() {
    this.count = this.notifications.filter(x => !x.status).length;
  }

  getNotifications() {
    const userId = this.identityService.getUserId();
    this.notificationService.getAllNotifications(userId).subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.notifications = response.data;
        }
        this.getCount();
      }
    });
  }
}