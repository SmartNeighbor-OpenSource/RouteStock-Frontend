import { Routes } from '@angular/router';
import { authGuard } from './shared/infrastructure/auth.guard';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },

  // IAM — públicas
  {
    path: '',
    loadChildren: () => import('./iam/presentation/iam.routes').then((m) => m.IAM_ROUTES),
  },

  // Catalog — protegida (cualquier usuario autenticado)
  {
    path: 'search',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./catalog/presentation/catalog.routes').then((m) => m.CATALOG_ROUTES),
  },

  // Cart — protegida (cualquier usuario autenticado)
  {
    path: 'cart',
    canActivate: [authGuard],
    loadChildren: () => import('./cart/presentation/cart.routes').then((m) => m.CART_ROUTES),
  },

  // Commerce — protegida (cualquier usuario autenticado; el detalle es público para
  // consumidores, las rutas de gestión usan merchantGuard internamente)
  {
    path: 'commerce',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./commerce/presentation/commerce.routes').then((m) => m.COMMERCE_ROUTES),
  },

  { path: '**', redirectTo: 'search' },
];
