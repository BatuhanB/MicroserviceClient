import { IdentityService } from './identity-service';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection: signalR.HubConnection;

  constructor(private identityService: IdentityService) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5025/notificationHub', {
        accessTokenFactory: () => this.identityService.getAccessToken()
      })
      .build();
  }

  public startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this.addNotificationListener();
      })
      .catch(err => {
        console.error('Error while starting connection: ', err);
      });
  }

  public addNotificationListener(): void {
    this.hubConnection.on('ReceiveMessage', (message: string) => {
      console.log('Notification received: ', message);
    });
  }
}
