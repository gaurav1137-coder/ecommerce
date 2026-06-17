import { Component, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar implements OnInit, OnDestroy {
  showNavbar = true;
  searchText = '';
  isProfileOpen = false;

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  public cartService = inject(CartService);
  public auth = inject(AuthService);
  public wishlistService = inject(WishlistService);
  private router = inject(Router);

  toggleProfile(event: MouseEvent) {
    event.stopPropagation();
    this.isProfileOpen = !this.isProfileOpen;
  }

  @HostListener('document:click')
  closeProfile() {
    this.isProfileOpen = false;
  }

  constructor() {
    // hide navbar on login and register pages
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.url;
        this.showNavbar = !url.includes('/login') && !url.includes('/register');
      });
  }

  ngOnInit() {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(val => {
      this.router.navigate(['/products'], {
        queryParams: { q: val.trim() || null }
      });
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearchInput() {
    this.searchSubject.next(this.searchText);
  }

  // 🔎 SEARCH (NOW WORKS WITH ROUTER)
  search() {
    this.router.navigate(['/products'], {
      queryParams: { q: this.searchText.trim() || null }
    });
  }

  // 🔐 LOGIN CHECK
  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  // 👤 USER NAME
  getUserName(): string {
    return this.auth.getUser()?.username || '';
  }

  // 🚪 LOGOUT
  logout() {
    this.auth.logout();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
