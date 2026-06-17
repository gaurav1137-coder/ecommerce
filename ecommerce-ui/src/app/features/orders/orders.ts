import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class Orders implements OnInit {
  selectedOrder: any = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.loadOrders();
  }

  get orders() {
    return this.orderService.getOrders();
  }

  openDetails(order: any) {
    const parsed = this.parseOrderStatus(order.status);
    this.selectedOrder = {
      ...order,
      parsedStatus: parsed.status,
      address: parsed.address,
      paymentMethod: parsed.paymentMethod,
      paymentStatus: parsed.paymentStatus
    };
  }

  closeDetails() {
    this.selectedOrder = null;
  }

  parseOrderStatus(statusStr: string) {
    if (!statusStr) return { status: 'Placed', address: 'Not available', paymentMethod: 'Razorpay', paymentStatus: 'Paid' };
    const parts = statusStr.split(';');
    const status = parts[0] || 'Placed';
    const addressPart = parts.find(p => p.startsWith('Address:'))?.replace('Address:', '') || 'Not available';
    const paymentMethodPart = parts.find(p => p.startsWith('PaymentMethod:'))?.replace('PaymentMethod:', '') || 'Razorpay';
    const paymentStatusPart = parts.find(p => p.startsWith('PaymentStatus:'))?.replace('PaymentStatus:', '') || 'Paid';
    return {
      status,
      address: addressPart,
      paymentMethod: paymentMethodPart,
      paymentStatus: paymentStatusPart
    };
  }
}
