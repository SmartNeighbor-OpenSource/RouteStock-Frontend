import { Routes } from '@angular/router';
import { authGuard, merchantGuard } from './shared/infrastructure/auth.guard';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },

  // IAM — públicas
  {
    path: '',
    loadChildren: () =>
      import('./iam/presentation/iam.routes').then(m => m.IAM_ROUTES)
  },

  // Catalog — protegida (cualquier usuario autenticado)
  {
    path: 'search',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./catalog/presentation/catalog.routes').then(m => m.CATALOG_ROUTES)
  },

  // Commerce — protegida (solo MERCHANT)
  {
    path: 'commerce',
    canActivate: [authGuard, merchantGuard],
    loadChildren: () =>
      import('./commerce/presentation/commerce.routes').then(m => m.COMMERCE_ROUTES)
  },

  { path: '**', redirectTo: 'search' }
];
