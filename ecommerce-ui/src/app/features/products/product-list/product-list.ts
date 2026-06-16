import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductList implements OnInit {
  products: any[] = [];
  allProducts: any[] = [];

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          oldPrice: p.discountPrice && p.discountPrice < p.price ? p.price : Math.floor(p.price * 1.25),
          rating: 4.5,
          image: p.imageUrl || (p.images && p.images.length > 0 ? p.images[0].imageUrl : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600')
        }));
        this.applyFilter();
      },
      error: (err) => console.error('Failed to load products', err)
    });

    this.route.queryParams.subscribe(params => {
      this.applyFilter(params['q']);
    });
  }

  applyFilter(query?: string) {
    const q = query || this.route.snapshot.queryParams['q'];
    if (q) {
      const search = q.toLowerCase();
      this.products = this.allProducts.filter(p =>
        p.name.toLowerCase().includes(search)
      );
    } else {
      this.products = [...this.allProducts];
    }
  }

  // 🛒 CART
  addToCart(product: any) {
    this.cartService.addItem(product).subscribe();
  }

  // ❤️ WISHLIST
  toggleWishlist(product: any) {
    this.wishlistService.toggle(product);
  }

  isWishlisted(id: number): boolean {
    return this.wishlistService.isInWishlist(id);
  }
}
