import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PhotostockModel } from '../models/photostock/photostockmodel';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class PhotostockService {
  private baseUrl: string = "http://localhost:5000/services/photostock/photos";

  constructor(private httpClient: HttpClient) { }

  upload(file:FormData):Observable<Response<PhotostockModel>>{
    return this.httpClient.post<Response<PhotostockModel>>(`${this.baseUrl}/save`,file);
  }

  delete(url:string):Observable<any>{
    return this.httpClient.delete(`${this.baseUrl}/delete/${url}`);
  }
}
