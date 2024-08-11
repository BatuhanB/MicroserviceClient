import { of } from 'rxjs';
import { NotificationModel } from '../../models/Notifications/notificationmodel';
import { IdentityService } from './../../services/identity-service';
import { NotificationService } from './../../services/notification.service';
import { Component,OnInit} from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {

  dumbData = of(
    { "title": "Notification 1", "status": false },
    { "title": "Notification 2", "status": false },
    { "title": "Notification 3", "status": false },
    { "title": "Notification 4", "status": false },
    { "title": "Notification 5", "status": false },
    { "title": "Notification 6", "status": false });
  count: number = 0;
  notifications: any[] = [];
  // notifications: NotificationModel[] = [];

  constructor(
    private notificationService: NotificationService,
    private identityService: IdentityService) {
    //this.notificationService.startConnection();
    // this.notifications = notificationService.addNotificationListener();
  }

  ngOnInit(): void {
    //this.getNotifications();
    this.loadData();
  }
  
  markAllAsRead() {
    this.notifications = [];
    this.dumbData.subscribe({
      next: res => {
        res.status = true;
        this.notifications.push(res);
      }
    })
    this.count = this.notifications.filter(x => !x.status).length;
  }

  markAsRead(){
    
  }
  
  loadData() {
    this.dumbData.subscribe({
      next: elem => {
        this.notifications.push(elem);
      }
    })
    this.count = this.notifications.filter(x => !x.status).length;
  }

  getNotifications() {
    const userId = this.identityService.getUserId();
    this.notificationService.getAllNotifications(userId).subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.notifications = response.data;
        }
      }
    });
  }

}
