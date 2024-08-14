import { AddressModel } from './../models/User/AddressModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private identityUrl = 'http://localhost:5004/api/address';

  constructor(private httpClient:HttpClient) { }

  public getById(id:string):Observable<Response<AddressModel>>{
    return this.httpClient.get<Response<AddressModel>>(`${this.identityUrl}/getbyid/${id}`);
  }

  public getByUserId(userId:string):Observable<Response<AddressModel[]>>{
    return this.httpClient.get<Response<AddressModel[]>>(`${this.identityUrl}/getbyuserid/${userId}`);
  }

  public update(address:AddressModel):Observable<Response<boolean>>{
    return this.httpClient.put<Response<boolean>>(`${this.identityUrl}/update`,address);
  }

  public create(address:AddressModel):Observable<Response<boolean>>{
    return this.httpClient.post<Response<boolean>>(`${this.identityUrl}/create`,address);
  }
}
