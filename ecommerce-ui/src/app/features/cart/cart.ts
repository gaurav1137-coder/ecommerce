// src/app/features/cart/cart.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// src/app/features/cart/cart.ts
import { CartService } from '../../services/cart.service';   // ✅ correct path

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class Cart {
  constructor(private cartService: CartService, private router: Router) {}

  get cartItems() {
    return this.cartService.getItems();
  }

  increase(item: any) { this.cartService.increaseQuantity(item.id); }
  decrease(item: any) { if (item.quantity > 1) this.cartService.decreaseQuantity(item.id); }
  removeItem(id: number) { this.cartService.removeItem(id); }
  get total() { return this.cartService.getTotal(); }

  goToCheckout() { this.router.navigate(['/checkout']); }
}
