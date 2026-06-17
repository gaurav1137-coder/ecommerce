import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Admin/dashboard`);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Admin/orders`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Order/status/${orderId}?status=${status}`, {});
  }
}
