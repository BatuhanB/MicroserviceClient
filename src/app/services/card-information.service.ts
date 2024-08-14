import { Injectable } from '@angular/core';
import { CardInformation } from '../models/User/CardInformation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class CardInformationService {

  private identityUrl = 'http://localhost:5004/api/cardinformation';

  constructor(private httpClient:HttpClient) { }

  public getById(id:string):Observable<Response<CardInformation>>{
    return this.httpClient.get<Response<CardInformation>>(`${this.identityUrl}/getbyid/${id}`);
  }

  public getByUserId(userId:string):Observable<Response<CardInformation[]>>{
    return this.httpClient.get<Response<CardInformation[]>>(`${this.identityUrl}/getbyuserid/${userId}`);
  }

  public update(cardInformation:CardInformation):Observable<Response<boolean>>{
    return this.httpClient.put<Response<boolean>>(`${this.identityUrl}/update`,cardInformation);
  }

  public create(cardInformation:CardInformation):Observable<Response<boolean>>{
    return this.httpClient.post<Response<boolean>>(`${this.identityUrl}/create`,cardInformation);
  }
}
