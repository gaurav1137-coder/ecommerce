import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Navbar } from './core/layout/navbar/navbar';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Navbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  showSessionExpiredModal = false;

  ngOnInit() {
    this.authService.sessionExpired$.subscribe(expired => {
      this.showSessionExpiredModal = expired;
    });
  }

  loginAgain() {
    this.authService.logout();
    this.authService.clearSessionExpired();
    this.router.navigate(['/login']);
  }

  cancelSessionExpired() {
    this.authService.clearSessionExpired();
  }
}
