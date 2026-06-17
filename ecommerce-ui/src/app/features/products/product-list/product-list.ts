import { Component, OnInit, inject, HostListener } from '@angular/core';
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
  page = 1;
  pageSize = 8;
  loading = false;
  hasMore = true;

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private route = inject(ActivatedRoute);

  private fallbackProducts = [
    {
      id: 1,
      name: 'Nike Air Max',
      price: 4999,
      oldPrice: 6999,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'
    },
    {
      id: 2,
      name: 'Premium Leather Jacket',
      price: 2999,
      oldPrice: 4999,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'
    },
    {
      id: 3,
      name: 'Luxury Silk Dress',
      price: 3499,
      oldPrice: 5999,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600'
    },
    {
      id: 4,
      name: 'Classic Luxury Handbag',
      price: 4999,
      oldPrice: 7999,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'
    },
    {
      id: 5,
      name: 'iPhone Pro Max',
      price: 89999,
      oldPrice: 99999,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'
    },
    {
      id: 6,
      name: 'Gaming Wireless Headset',
      price: 3999,
      oldPrice: 5999,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'
    },
    {
      id: 7,
      name: 'Apple Watch Ultra',
      price: 19999,
      oldPrice: 22999,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'
    },
    {
      id: 8,
      name: 'Sports Training Sneakers',
      price: 5999,
      oldPrice: 7999,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600'
    }
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loadProducts(true, params['q']);
    });
  }

  loadProducts(reset: boolean = false, queryStr?: string) {
    if (this.loading) return;
    if (!reset && !this.hasMore) return;

    if (reset) {
      this.page = 1;
      this.products = [];
      this.hasMore = true;
    }

    this.loading = true;
    const search = queryStr !== undefined ? queryStr : (this.route.snapshot.queryParams['q'] || '');

    this.productService.getProductsPaged(search, this.page, this.pageSize).subscribe({
      next: (res) => {
        const data = res.products || res.Products || [];
        const total = res.totalItems !== undefined ? res.totalItems : (res.TotalItems !== undefined ? res.TotalItems : 0);

        const newProducts = data.map((p: any) => ({
          id: p.id || p.Id,
          name: p.name || p.Name,
          price: p.price || p.Price,
          oldPrice: (p.discountPrice || p.DiscountPrice) && (p.discountPrice || p.DiscountPrice) < (p.price || p.Price) ? (p.price || p.Price) : Math.floor((p.price || p.Price) * 1.25),
          rating: 4.5,
          image: p.imageUrl || p.ImageUrl || (p.images && p.images.length > 0 ? p.images[0].imageUrl : (p.Images && p.Images.length > 0 ? p.Images[0].ImageUrl : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'))
        }));

        this.products = [...this.products, ...newProducts];
        this.hasMore = this.products.length < total;
        this.page++;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.hasMore = false;
        if (reset && this.products.length === 0) {
          const search = (queryStr || '').toLowerCase();
          this.products = search
            ? this.fallbackProducts.filter(product => product.name.toLowerCase().includes(search))
            : [...this.fallbackProducts];
        }
        this.loading = false;
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const threshold = 150;
    const position = window.innerHeight + window.pageYOffset;
    const height = document.documentElement.scrollHeight;
    
    if (position >= height - threshold) {
      this.loadProducts();
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
