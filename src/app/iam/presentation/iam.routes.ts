import { Routes } from '@angular/router';
import { authGuard } from '../../shared/infrastructure/auth.guard';

export const IAM_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./views/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./views/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./views/profile/profile.component').then((m) => m.ProfileComponent),
  },
];
