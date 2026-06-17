import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  const isAuthRequest = req.url.includes('/Auth/') || req.url.includes('/auth/');

  if (token && !isAuthRequest) {
    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;
      const now = Date.now() / 1000;
      if (exp && now > exp) {
        // Expired!
        authService.triggerSessionExpired();
      }
    } catch (e) {
      console.error('Error decoding JWT token', e);
    }
  }

  let authReq = req;
  if (token && !isAuthRequest) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq);
};
