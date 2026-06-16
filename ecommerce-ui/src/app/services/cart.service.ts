import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private items: any[] = [];

  constructor() {
    // Reactively load or clear cart items when the user login status changes
    this.authService.currentUser$.subscribe(user => {
      if (user && user.id) {
        this.loadCart(user.id);
      } else {
        this.items = [];
      }
    });
  }

  loadCart(userId?: number) {
    const id = userId || this.authService.getUser()?.id;
    if (id) {
      this.http.get<any>(`${environment.apiUrl}/Cart/${id}`).subscribe({
        next: (data) => {
          if (data && data.cartItems) {
            this.items = data.cartItems.map((ci: any) => {
              const p = ci.product;
              const img = p.imageUrl || (p.images && p.images.length > 0 ? p.images[0].imageUrl : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600');
              return {
                ...p,
                image: img,
                quantity: ci.quantity,
                cartItemId: ci.id
              };
            });
          } else {
            this.items = [];
          }
        },
        error: (err) => console.error('Failed to load cart', err)
      });
    }
  }

  getItems() {
    return this.items;
  }

  addItem(product: any): Observable<any> {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      this.toastr.warning('Please log in to add items to cart');
      return new Observable(sub => sub.error('Not logged in'));
    }

    const qtyToAdd = product.quantity || 1;
    const existing = this.items.find(i => i.id === product.id);

    return this.http.post(`${environment.apiUrl}/Cart/add`, {
      userId: user.id,
      productId: product.id,
      quantity: qtyToAdd
    }).pipe(
      tap({
        next: () => {
          if (existing) {
            existing.quantity += qtyToAdd;
          } else {
            // reload the cart to get correct cartItemId
            this.loadCart(user.id);
          }
          this.toastr.success(`${product.name} added to cart!`);
        },
        error: (err) => {
          console.error('Failed to add to cart', err);
          this.toastr.error('Failed to add item to cart');
        }
      })
    );
  }

  increaseQuantity(id: number) {
    const user = this.authService.getUser();
    if (!user || !user.id) return;

    const item = this.items.find(i => i.id === id);
    if (item) {
      const newQty = item.quantity + 1;
      this.http.put(`${environment.apiUrl}/Cart/update`, {
        userId: user.id,
        productId: id,
        quantity: newQty
      }).subscribe({
        next: () => {
          item.quantity = newQty;
          this.toastr.success('Updated cart quantity');
        },
        error: (err) => {
          console.error('Failed to update quantity', err);
          this.toastr.error('Failed to update quantity');
        }
      });
    }
  }

  decreaseQuantity(id: number) {
    const user = this.authService.getUser();
    if (!user || !user.id) return;

    const item = this.items.find(i => i.id === id);
    if (item && item.quantity > 1) {
      const newQty = item.quantity - 1;
      this.http.put(`${environment.apiUrl}/Cart/update`, {
        userId: user.id,
        productId: id,
        quantity: newQty
      }).subscribe({
        next: () => {
          item.quantity = newQty;
          this.toastr.success('Updated cart quantity');
        },
        error: (err) => {
          console.error('Failed to update quantity', err);
          this.toastr.error('Failed to update quantity');
        }
      });
    }
  }

  removeItem(id: number) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;

    const cartItemId = item.cartItemId;
    if (cartItemId) {
      this.http.delete(`${environment.apiUrl}/Cart/${cartItemId}`).subscribe({
        next: () => {
          this.items = this.items.filter(i => i.id !== id);
          this.toastr.success(`${item.name} removed from cart`);
        },
        error: (err) => {
          console.error('Failed to remove item', err);
          this.toastr.error('Failed to remove item from cart');
        }
      });
    }
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart() {
    const user = this.authService.getUser();
    if (user && user.id) {
      this.http.delete(`${environment.apiUrl}/Cart/clear/${user.id}`).subscribe({
        next: () => {
          this.items = [];
          this.toastr.success('Cart cleared');
        },
        error: (err) => {
          console.error('Failed to clear cart', err);
          this.toastr.error('Failed to clear cart');
        }
      });
    } else {
      this.items = [];
    }
  }
}
