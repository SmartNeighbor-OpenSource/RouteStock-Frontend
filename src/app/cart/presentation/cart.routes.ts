import { Routes } from '@angular/router';

export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../presentation/view/cart/cart.component').then((m) => m.CartComponent),
  },
];
