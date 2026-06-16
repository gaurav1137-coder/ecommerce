import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../services/cart.service';
import { PaymentService } from "../../services/product.service";
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class Checkout {

  constructor(
    public cartService: CartService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private router: Router
  ) {}

  address = {
    name: '',
    phone: '',
    city: '',
    addressLine: ''
  };

  get items() {
    return this.cartService.getItems();
  }

  get total() {
    return this.cartService.getTotal();
  }

  proceedToPayment() {

    // 1️⃣ VALIDATION
    if (!this.address.name || !this.address.phone || !this.address.addressLine) {
      alert('Please fill all address fields');
      return;
    }

    if (this.items.length === 0) {
      alert('Cart is empty');
      return;
    }

    // 2️⃣ RAZORPAY PAYMENT
    this.paymentService.pay(this.total, (res: any) => {

      // 3️⃣ CREATE ORDER AFTER SUCCESS
      this.orderService.addOrder({
        id: Date.now(),
        items: this.items,
        total: this.total,
        address: this.address,
        paymentId: res.razorpay_payment_id,
        status: 'Paid',
        date: new Date()
      });

      // 4️⃣ CLEAR CART
      this.cartService.clearCart();

      // 5️⃣ GO TO ORDERS PAGE
      this.router.navigate(['/orders']);
    });
  }
}
