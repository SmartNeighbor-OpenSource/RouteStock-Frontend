import { Routes } from '@angular/router';

export const IAM_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./views/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./views/register/register.component').then(m => m.RegisterComponent)
  }
];
