import { NotificationModel } from '../../models/Notifications/notificationmodel';
import { IdentityService } from './../../services/identity-service';
import { NotificationService } from './../../services/notification.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit{

  notifications:NotificationModel[] = [];
  
  constructor(
    private notificationService:NotificationService,
    private identityService:IdentityService) {
    this.notificationService.startConnection();
    // this.notifications = notificationService.addNotificationListener();
  }

  ngOnInit(): void {
    this.getNotifications();
  }

  getNotifications(){
    const userId = this.identityService.getUserId();
    this.notificationService.getAllNotifications(userId).subscribe({
      next:response=>{
        if(response.isSuccessful){
          this.notifications = response.data;
        }
      }
    });
  }

}
