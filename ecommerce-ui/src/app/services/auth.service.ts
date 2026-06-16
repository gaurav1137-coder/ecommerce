import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // BehaviorSubject initialized with the currently stored user (or null)
  public currentUser$ = new BehaviorSubject<any>(this.getUserInternal());

  constructor() {}

  private getUserInternal() {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  login(mobileNumber: string, otp: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Auth/login`, { mobileNumber, otp }).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          const role = res.user.roleId === 1 ? 'admin' : 'user';
          const userObj = {
            id: res.user.id,
            username: res.user.name,
            role: role,
            mobileNumber: res.user.mobileNumber,
            email: res.user.email
          };
          localStorage.setItem('user', JSON.stringify(userObj));
          this.currentUser$.next(userObj);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return this.currentUser$.value !== null;
  }

  getUser() {
    return this.currentUser$.value || {};
  }

  updateUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser$.next(user);
  }

  isAdmin() {
    return this.getUser()?.role === 'admin';
  }
}
