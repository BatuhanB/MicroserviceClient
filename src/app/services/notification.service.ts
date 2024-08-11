import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IdentityService } from './identity-service';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, catchError, of } from 'rxjs';
import { Response } from '../models/response';
import { NotificationModel } from '../models/Notifications/notificationmodel';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl: string = "http://localhost:5025";
  private hubConnection: signalR.HubConnection;

  constructor(
    private identityService: IdentityService,
    private http: HttpClient
  ) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/notificationHub`, {
        accessTokenFactory: () => this.identityService.getAccessToken(),
      })
      .withAutomaticReconnect()
      .build();
  }

  public startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
      })
      .catch(err => {
        console.error('Error while starting connection: ', err);
      });
  }

  public addNotificationListener(): void {
    this.hubConnection.on('ReceiveMessage', (messages: NotificationModel[]) => {
    });
  }

  // Delete a single notification
  deleteNotification(id: string): Observable<Response<boolean>> {
    return this.http.delete<Response<boolean>>(`${this.baseUrl}/services/notification/d/${id}`)
      .pipe(catchError(this.handleError<Response<boolean>>('deleteNotification')));
  }
  // Get a single notification by userId
  getNotification(userId: string): Observable<Response<NotificationModel>> {
    return this.http.get<Response<NotificationModel>>(`${this.baseUrl}/services/notification/g/${userId}`)
      .pipe(catchError(this.handleError<Response<NotificationModel>>('getNotification')));
  }

  // Get all notifications by userId
  getAllNotifications(userId: string): Observable<Response<NotificationModel[]>> {
    return this.http.get<Response<NotificationModel[]>>(`${this.baseUrl}/services/notifications/g/${userId}`)
      .pipe(catchError(this.handleError<Response<NotificationModel[]>>('getAllNotifications')));
  }

  // Save or update multiple notifications
  save(notifications: NotificationModel[]): Observable<Response<boolean>> {
    return this.http.post<Response<boolean>>(`${this.baseUrl}/services/notification/u/`, notifications, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(catchError(this.handleError<Response<boolean>>('saveNotifications')));
  }

  // Mark All As Read
  markAllAsRead(userId:string): Observable<Response<boolean>> {
    return this.http.get<Response<boolean>>(`${this.baseUrl}/services/notifications/m/${userId}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(catchError(this.handleError<Response<boolean>>('markAllAsReadNotifications')));
  }

  // Handle HTTP errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}