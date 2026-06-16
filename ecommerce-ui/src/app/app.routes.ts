import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';    
export const routes: Routes = [

  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },

  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list').then(m => m.ProductList)
  },

  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/products/product-details/product-details').then(m => m.ProductDetails)
  },

  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart').then(m => m.Cart)
  },

  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/wishlist/wishlist').then(m => m.Wishlist)
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile').then(m => m.Profile)
  },

  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/orders').then(m => m.Orders)
  },

  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout').then(m => m.Checkout)
  },

  {
    path: 'order-success',
    loadComponent: () =>
      import('./features/order-success/order-success').then(m => m.OrderSuccess)
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin').then(m => m.Admin)
  },

  {
    path: '**',
    redirectTo: ''
  }
];
