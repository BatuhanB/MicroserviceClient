import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseCreateModel } from '../../models/Catalog/Course/CourseCreateModel';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private baseUrl: string = "http://localhost:5000/services/catalog/";

  constructor(private httpClient: HttpClient) { }

  getAllByUserId(userId: string): Observable<any> {
    return this.httpClient.get(this.baseUrl + "courses/getallbyuseridwithcategory/" + userId, {
      headers: this.headers
    });
  }

  getById(id: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}courses/getbyid/${id}`, {
      headers: this.headers
    });
  }

  create(courseModel: CourseCreateModel): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}courses/create`, courseModel, {
      headers: this.headers
    });
  }

  update(courseModel: FormData): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}courses/update`, courseModel);
  }

  delete(id:string) :Observable<any>{
    return this.httpClient.delete(`${this.baseUrl}courses/delete/${id}`);
  }
}
