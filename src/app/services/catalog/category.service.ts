import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryModel } from '../../models/Catalog/Category/CategoryModel';
import { Response } from '../../models/response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private baseUrl: string = "http://localhost:5000/services/catalog/";

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}categories/getall`, {
      headers: this.headers
    });
  }

  getById(id: string): Observable<Response<CategoryModel>> {
    return this.httpClient.get(`${this.baseUrl}categories/getbyid/${id}`, {
      headers: this.headers
    });
  }
}