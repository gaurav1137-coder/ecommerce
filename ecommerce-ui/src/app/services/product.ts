import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${environment.apiUrl}/Product`
    ).pipe(timeout(15000));
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${environment.apiUrl}/Product/${id}`
    ).pipe(timeout(15000));
  }

  getProductsPaged(search?: string, page?: number, pageSize?: number, categoryId?: number): Observable<any> {
    let params: any = {};
    if (search) params.search = search;
    if (page) params.page = page.toString();
    if (pageSize) params.pageSize = pageSize.toString();
    if (categoryId) params.categoryId = categoryId.toString();

    return this.http.get<any>(`${environment.apiUrl}/Product`, { params }).pipe(timeout(15000));
  }
}
