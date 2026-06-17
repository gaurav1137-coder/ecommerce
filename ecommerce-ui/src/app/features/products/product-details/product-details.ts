import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.scss']
})
export class ProductDetails implements OnInit {
  selectedSize = 'M';
  sizes = ['S', 'M', 'L', 'XL'];
  quantity = 1;
  product: any;
  selectedImage: string = '';
  productImages: string[] = [];
  loading = true;
  errorMsg = '';

  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private fallbackProducts = [
    {
      id: 1,
      name: 'Nike Air Max',
      price: 4999,
      oldPrice: 6999,
      rating: 4.8,
      description: 'High-performance lifestyle running shoes with responsive cushioning.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000'
    },
    {
      id: 2,
      name: 'Premium Leather Jacket',
      price: 2999,
      oldPrice: 4999,
      rating: 4.7,
      description: 'A premium jacket with a clean modern fit and durable finish.',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000'
    },
    {
      id: 3,
      name: 'Luxury Silk Dress',
      price: 3499,
      oldPrice: 5999,
      rating: 4.9,
      description: 'Elegant occasion wear designed for a soft, refined look.',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000'
    },
    {
      id: 4,
      name: 'Classic Luxury Handbag',
      price: 4999,
      oldPrice: 7999,
      rating: 4.8,
      description: 'A structured handbag with premium styling and everyday utility.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000'
    },
    {
      id: 5,
      name: 'iPhone Pro Max',
      price: 89999,
      oldPrice: 99999,
      rating: 4.9,
      description: 'A flagship smartphone with a vivid display and premium performance.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000'
    },
    {
      id: 6,
      name: 'Gaming Wireless Headset',
      price: 3999,
      oldPrice: 5999,
      rating: 4.8,
      description: 'Wireless gaming audio with comfortable padding and immersive sound.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000'
    },
    {
      id: 7,
      name: 'Apple Watch Ultra',
      price: 19999,
      oldPrice: 22999,
      rating: 4.7,
      description: 'A rugged smartwatch built for fitness, style, and daily tracking.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000'
    },
    {
      id: 8,
      name: 'Sports Training Sneakers',
      price: 5999,
      oldPrice: 7999,
      rating: 4.6,
      description: 'Breathable training sneakers with traction for active days.',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000'
    }
  ];

  isWishlisted(id: number): boolean {
    return this.wishlistService.isInWishlist(id);
  }

  toggleWishlist(product: any) {
    this.wishlistService.toggle(product);
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      this.loading = true;
      this.errorMsg = '';
      this.productService.getProduct(id).subscribe({
        next: (data: any) => {
          this.product = {
            id: data.id,
            name: data.name,
            price: data.price,
            oldPrice: data.discountPrice && data.discountPrice < data.price ? data.price : Math.floor(data.price * 1.25),
            rating: 4.8,
            description: data.description || 'No description available for this premium item.',
            image: data.imageUrl || (data.images && data.images.length > 0 ? data.images[0].imageUrl : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000')
          };

          if (data.images && data.images.length > 0) {
            this.productImages = data.images.map((img: any) => img.imageUrl);
          } else {
            this.productImages = [this.product.image];
          }
          this.selectedImage = this.product.image;

          if (data.sizes && data.sizes.length > 0) {
            this.sizes = data.sizes.map((s: any) => s.size);
            this.selectedSize = this.sizes[0];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load product details', err);
          const fallback = this.fallbackProducts.find(item => item.id === id);
          if (fallback) {
            this.product = fallback;
            this.productImages = [fallback.image];
            this.selectedImage = fallback.image;
            this.errorMsg = '';
          } else {
            this.errorMsg = 'Product details could not be found or loaded.';
          }
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      this.errorMsg = 'No product specified.';
    }
  }

  increase() {
    this.quantity++;
  }

  decrease() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    if (!this.product) return;
    this.cartService.addItem({
      ...this.product,
      quantity: this.quantity,
      size: this.selectedSize
    }).subscribe({
      next: () => {
        this.router.navigate(['/cart']);
      }
    });
  }

  buyNow() {
    if (!this.product) return;
    this.cartService.addItem({
      ...this.product,
      quantity: this.quantity,
      size: this.selectedSize
    }).subscribe({
      next: () => {
        this.router.navigate(['/checkout']);
      }
    });
  }
}
