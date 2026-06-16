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
  expandedOrderId: number | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.loadOrders();
  }

  get orders() {
    return this.orderService.getOrders();
  }

  toggleDetails(orderId: number) {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
    } else {
      this.expandedOrderId = orderId;
    }
  }
}
