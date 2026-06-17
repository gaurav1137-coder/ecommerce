import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'rxjs/operators';

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
      this.http.get<any[]>(`${environment.apiUrl}/Wishlist/${id}`).pipe(timeout(20000)).subscribe({
        next: (data) => {
          this.items = data.map(item => {
            const p = item.product || item.Product;
            if (!p) return null;
            const images = p.images || p.Images;
            const img = p.imageUrl || p.ImageUrl || (images && images.length > 0 ? (images[0].imageUrl || images[0].ImageUrl) : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600');
            return {
              ...p,
              id: p.id || p.Id,
              name: p.name || p.Name,
              price: p.price || p.Price,
              image: img,
              wishlistId: item.id || item.Id
            };
          }).filter(x => x !== null);
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

    const productId = product.id || product.Id;
    const exists = this.items.find(i => i.id === productId);
    if (!exists) {
      this.http.post<any>(`${environment.apiUrl}/Wishlist`, {
        userId: user.id,
        productId: productId
      }).pipe(timeout(20000)).subscribe({
        next: (res) => {
          const wId = res.id || res.Id;
          this.items.push({
            ...product,
            id: productId,
            wishlistId: wId
          });
          this.toastr.success(`${product.name || product.Name} added to wishlist!`);
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
      this.http.delete(`${environment.apiUrl}/Wishlist/${idToDelete}`).pipe(timeout(20000)).subscribe({
        next: () => {
          this.items = this.items.filter(i => i.id !== id);
          this.toastr.success(`${item.name || item.Name} removed from wishlist`);
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
    const productId = product.id || product.Id;
    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(product);
    }
  }

  getCount(): number {
    return this.items.length;
  }
}
