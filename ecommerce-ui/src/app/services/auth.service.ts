import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // BehaviorSubject initialized with the currently stored user (or null)
  public currentUser$ = new BehaviorSubject<any>(this.getUserInternal());
  public sessionExpired$ = new BehaviorSubject<boolean>(false);

  triggerSessionExpired() {
    this.sessionExpired$.next(true);
  }

  clearSessionExpired() {
    this.sessionExpired$.next(false);
  }

  register(name: string, email: string, mobileNumber: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Auth/register`, { name, email, mobileNumber });
  }

  constructor() {}

  private getUserInternal() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const exp = decoded.exp;
        const now = Date.now() / 1000;
        if (exp && now > exp) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          return null;
        }
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
    }
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  login(mobileNumber: string, otp: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Auth/login`, { mobileNumber, otp }).pipe(
      timeout(15000),
      tap(res => {
        const token = res?.token ?? res?.Token;
        const user = res?.user ?? res?.User;

        if (token && user) {
          localStorage.setItem('token', token);
          const roleId = user.roleId ?? user.RoleId;
          const role = roleId === 1 ? 'admin' : 'user';
          const userObj = {
            id: user.id ?? user.Id,
            username: user.name ?? user.Name,
            role: role,
            mobileNumber: user.mobileNumber ?? user.MobileNumber,
            email: user.email ?? user.Email
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
