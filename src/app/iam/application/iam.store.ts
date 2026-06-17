import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { retry } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IamApi } from '../infrastructure/iam-api';
import { User } from '../domain/model/user.entity';
import { Credentials } from '../domain/model/credentials.entity';
import { UserRole } from '../domain/model/user-role.enum';

@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly currentUserSignal = signal<User | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isMerchant = computed(() => this.currentUser()?.role === UserRole.MERCHANT);
  readonly isConsumer = computed(() => this.currentUser()?.role === UserRole.CONSUMER);

  constructor(
    private readonly iamApi: IamApi,
    private readonly router: Router
  ) {}

  login(credentials: Credentials): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.login(credentials).pipe(retry(1)).subscribe({
      next: user => {
        this.currentUserSignal.set(user);
        this.loadingSignal.set(false);
        const destination = user.isMerchant() ? '/commerce' : '/search';
        this.router.navigate([destination]);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error al iniciar sesión'));
        this.loadingSignal.set(false);
      }
    });
  }

  register(user: User, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.register(user, password).pipe(retry(1)).subscribe({
      next: () => {
        this.loadingSignal.set(false);
        this.router.navigate(['/login']);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error al registrarse'));
        this.loadingSignal.set(false);
      }
    });
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) return error.message;
    return fallback;
  }
}
