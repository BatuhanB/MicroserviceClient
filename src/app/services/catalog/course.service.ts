import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private baseUrl:string = "http://localhost:5000/services/catalog/";


  constructor(private httpClient:HttpClient) { }

  getAllByUserId(userId:string):Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.httpClient.get(this.baseUrl + "courses/getallbyuseridwithcategory/" + userId,{
      headers:headers
    });
  }

  create(){

  }

  update(){

  }

  delete(){

  }
}
