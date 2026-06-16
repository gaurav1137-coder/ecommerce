import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class Admin {

  products = [
    { id: 1, name: 'Nike Air Max', price: 4999 },
    { id: 2, name: 'Apple Watch', price: 19999 }
  ];

  newProduct = {
    name: '',
    price: 0
  };

  addProduct() {
    this.products.push({
      id: Date.now(),
      name: this.newProduct.name,
      price: this.newProduct.price
    });

    this.newProduct = { name: '', price: 0 };
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }
}
