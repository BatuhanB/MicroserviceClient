import { PageRequest } from './../../models/pagerequest';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseCreateModel } from '../../models/Catalog/Course/CourseCreateModel';
import { CourseUpdateModel } from '../../models/Catalog/Course/CourseUpdateModel';
import { CourseViewModel } from '../../models/Catalog/Course/CourseViewModel';
import { Response } from '../../models/response';
import { Paging } from '../../models/paging';
import { CourseWithCategoryViewModel } from '../../models/Catalog/Course/CourseWithCategoryModel';
import { CourseGetByIdModel } from '../../models/Catalog/Course/CourseGetByIdModel';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private baseUrl: string = "http://localhost:5000/services/catalog/";

  constructor(private httpClient: HttpClient) { }

  getAllByUserId(userId: string, request: PageRequest): Observable<Response<Paging<CourseWithCategoryViewModel>>> {
    let params = new HttpParams()
    .set('PageNumber', (request.pageNumber + 1).toString())
    .set('PageSize', request.pageSize.toString());
    return this.httpClient.get<Response<Paging<CourseWithCategoryViewModel>>>(this.baseUrl + "courses/getallbyuseridwithcategory/" + userId, {
      params:params,
      headers: this.headers
    });
  }

  getAllWithCategory(request: PageRequest): Observable<Response<Paging<CourseViewModel>>> {
    let params = new HttpParams()
      .set('PageNumber', (request.pageNumber + 1).toString())
      .set('PageSize', request.pageSize.toString());
    return this.httpClient.get<Response<Paging<CourseViewModel>>>(this.baseUrl + "courses/getallwithcategory",{
      params:params
    });
  }

  getById(id: string): Observable<Response<CourseGetByIdModel>> {
    return this.httpClient.get(`${this.baseUrl}courses/getbyid/${id}`, {
      headers: this.headers
    });
  }

  create(courseModel: CourseCreateModel): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}courses/create`, courseModel, {
      headers: this.headers
    });
  }

  update(courseModel: CourseUpdateModel): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}courses/update`, courseModel);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}courses/delete/${id}`);
  }
}
