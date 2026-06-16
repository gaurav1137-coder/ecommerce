import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.scss']
})
export class Wishlist {

  constructor(public wishlistService: WishlistService) {}

  get items() {
    return this.wishlistService.getItems();
  }

  remove(id: number) {
    this.wishlistService.removeFromWishlist(id);
  }

  clearAll() {
    this.wishlistService['items'] = []; // simple reset
  }
}
