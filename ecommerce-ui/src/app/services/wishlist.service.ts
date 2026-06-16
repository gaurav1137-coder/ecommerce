import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private items: any[] = [];

  constructor() {
    // Reactively load or clear wishlist when user login status changes
    this.authService.currentUser$.subscribe(user => {
      if (user && user.id) {
        this.loadWishlist(user.id);
      } else {
        this.items = [];
      }
    });
  }

  loadWishlist(userId?: number) {
    const id = userId || this.authService.getUser()?.id;
    if (id) {
      this.http.get<any[]>(`${environment.apiUrl}/Wishlist/${id}`).subscribe({
        next: (data) => {
          this.items = data.map(item => {
            const p = item.product;
            const img = p.imageUrl || (p.images && p.images.length > 0 ? p.images[0].imageUrl : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600');
            return {
              ...p,
              image: img,
              wishlistId: item.id
            };
          });
        },
        error: (err) => console.error('Failed to load wishlist', err)
      });
    }
  }

  getItems() {
    return this.items;
  }

  addToWishlist(product: any) {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      this.toastr.warning('Please log in to add items to wishlist');
      return;
    }

    const exists = this.items.find(i => i.id === product.id);
    if (!exists) {
      this.http.post<any>(`${environment.apiUrl}/Wishlist`, {
        userId: user.id,
        productId: product.id
      }).subscribe({
        next: (res) => {
          this.items.push({
            ...product,
            wishlistId: res.id
          });
          this.toastr.success(`${product.name} added to wishlist!`);
        },
        error: (err) => {
          console.error('Failed to add to wishlist', err);
          this.toastr.error('Failed to add to wishlist');
        }
      });
    }
  }

  removeFromWishlist(id: number) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;

    const idToDelete = item.wishlistId;
    if (idToDelete) {
      this.http.delete(`${environment.apiUrl}/Wishlist/${idToDelete}`).subscribe({
        next: () => {
          this.items = this.items.filter(i => i.id !== id);
          this.toastr.success(`${item.name} removed from wishlist`);
        },
        error: (err) => {
          console.error('Failed to remove from wishlist', err);
          this.toastr.error('Failed to remove from wishlist');
        }
      });
    }
  }

  isInWishlist(id: number): boolean {
    return this.items.some(i => i.id === id);
  }

  toggle(product: any) {
    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }

  getCount(): number {
    return this.items.length;
  }
}
