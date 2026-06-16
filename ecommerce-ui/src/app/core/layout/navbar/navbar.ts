import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {
  showNavbar = true;
  searchText = '';
  isProfileOpen = false;

  toggleProfile(event: MouseEvent) {
    event.stopPropagation();
    this.isProfileOpen = !this.isProfileOpen;
  }

  @HostListener('document:click')
  closeProfile() {
    this.isProfileOpen = false;
  }

  constructor(
    public cartService: CartService,
    public auth: AuthService,
    private router: Router
  )  {

    // hide navbar on login page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {

        this.showNavbar = !event.url.includes('/login');

      });
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
