import { Component, OnInit, HostListener } from '@angular/core';
import { NotificationModel } from '../../models/Notifications/notificationmodel';
import { IdentityService } from '../../services/identity-service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  count: number;
  notifications: NotificationModel[] = [];
  isLoadingMore: boolean = false;
  latestId: string | null = null;
  lastFetchedNotifications: NotificationModel[] = [];
  noMoreNotifications: boolean = false; // New flag to stop further API calls

  constructor(
    private notificationService: NotificationService,
    private identityService: IdentityService
  ) {}

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
    });
    this.getCount();
  }

  private getCount() {
    this.count = this.notifications.filter(x => !x.status).length;
    this.notificationService.updateCount(this.count);
  }

  getNotifications() {
    const userId = this.identityService.getUserId();
    this.notificationService.getAllNotifications(userId).subscribe({
      next: response => {
        if (response && response.isSuccessful) {
          this.notifications = response.data;
          this.latestId = this.notifications[this.notifications.length - 1]?.id;
          this.getCount();
        }
      }
    });
  }

  getNotificationsCursorPagination() {
    if (this.isLoadingMore || this.noMoreNotifications || !this.latestId) return;

    this.isLoadingMore = true;
    const userId = this.identityService.getUserId();
    this.notificationService.getAllNotificationsCursorPagination(userId, this.latestId).subscribe({
      next: response => {
        if (response && response.isSuccessful) {
          const newNotifications = response.data;

          // Check for repetition
          if (this.areNotificationsRepeating(newNotifications)) {
            this.noMoreNotifications = true;
          } else {
            this.notifications = [...this.notifications, ...newNotifications];
            this.latestId = newNotifications[newNotifications.length - 1]?.id;
            this.lastFetchedNotifications = newNotifications;
            this.getCount();
          }
        }
        this.isLoadingMore = false;
      },
      error: () => {
        this.isLoadingMore = false;
      }
    });
  }

  // Method to check if new notifications are repeating
  areNotificationsRepeating(newNotifications: NotificationModel[]): boolean {
    if (this.lastFetchedNotifications.length !== newNotifications.length) return false;

    for (let i = 0; i < newNotifications.length; i++) {
      if (newNotifications[i].id !== this.lastFetchedNotifications[i].id) {
        return false;
      }
    }
    return true;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.getNotificationsCursorPagination();
    }
  }
}
