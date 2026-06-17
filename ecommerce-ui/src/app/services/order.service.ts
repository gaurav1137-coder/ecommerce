import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private orders$ = new BehaviorSubject<any[]>([]);

  constructor() {
    // Reactively load or clear orders when user login status changes
    this.authService.currentUser$.subscribe(user => {
      if (user && user.id) {
        this.loadOrders(user.id);
      } else {
        this.clearOrders();
      }
    });
  }

  loadOrders(userId?: number) {
    const id = userId || this.authService.getUser()?.id;
    if (id) {
      this.http.get<any[]>(`${environment.apiUrl}/Order/user/${id}`).subscribe({
        next: (data) => {
          const mapped = data.map(o => ({
            id: o.id,
            total: o.totalAmount,
            status: o.status,
            date: new Date(o.orderDate).toLocaleString(),
            paymentId: o.paymentId || ('pay_nz_' + o.id + Math.floor(Math.random() * 1000)),
            items: o.orderItems ? o.orderItems.map((oi: any) => ({
              id: oi.id,
              name: oi.product?.name || 'Product',
              description: oi.product?.description || 'No description available for this premium item.',
              quantity: oi.quantity,
              price: oi.price,
              image: oi.product?.imageUrl || (oi.product?.images && oi.product.images.length > 0 ? oi.product.images[0].imageUrl : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600')
            })) : []
          }));
          this.orders$.next(mapped);
        },
        error: (err) => console.error('Failed to load orders', err)
      });
    }
  }

  addOrder(order: any) {
    const user = this.authService.getUser();
    if (!user || !user.id) return;

    const addressStr = `${order.address.addressLine}, ${order.address.city}`;

    this.http.post<any>(`${environment.apiUrl}/Order/place`, {
      userId: user.id,
      totalAmount: order.total,
      paymentMethod: 'Razorpay',
      address: addressStr
    }).subscribe({
      next: () => {
        this.loadOrders(user.id);
        this.toastr.success('Order placed successfully! 🧾');
      },
      error: (err) => {
        console.error('Failed to place order in backend', err);
        this.toastr.error('Failed to place order');
      }
    });
  }

  getOrders() {
    return this.orders$.value;
  }

  clearOrders() {
    this.orders$.next([]);
  }
}
