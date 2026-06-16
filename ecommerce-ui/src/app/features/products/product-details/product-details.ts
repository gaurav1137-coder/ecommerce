import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
          this.errorMsg = 'Product details could not be found or loaded.';
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
