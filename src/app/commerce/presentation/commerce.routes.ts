import { Routes } from '@angular/router';

export const COMMERCE_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./views/commerce-detail/commerce-detail.component').then(m => m.CommerceDetailComponent)
  }
];
