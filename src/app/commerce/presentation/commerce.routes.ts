import { Routes } from '@angular/router';
import { merchantGuard } from '../../shared/infrastructure/auth.guard';

export const COMMERCE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [merchantGuard],
    loadComponent: () =>
      import('./views/my-commerces/my-commerces.component').then((m) => m.MyCommercesComponent),
  },
  {
    path: 'new',
    canActivate: [merchantGuard],
    loadComponent: () =>
      import('./views/new-commerce/new-commerce.component').then((m) => m.NewCommerceComponent),
  },
  {
    path: ':id/products',
    canActivate: [merchantGuard],
    loadComponent: () =>
      import('../../catalog/presentation/views/my-commerce-product/my-commerce-products.component').then(
        (m) => m.MyCommerceProductsComponent,
      ),
  },
  {
    // Detalle público del comercio — accesible para cualquier usuario autenticado (consumidor o merchant)
    path: ':id',
    loadComponent: () =>
      import('./views/commerce-detail/commerce-detail.component').then(
        (m) => m.CommerceDetailComponent,
      ),
  },
];
