import { computed, Injectable, signal } from '@angular/core';
import { retry } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommerceApi } from '../infrastructure/commerce-api';
import { Commerce } from '../domain/model/commerce.entity';

@Injectable({ providedIn: 'root' })
export class CommerceStore {
  private readonly commercesSignal = signal<Commerce[]>([]);
  readonly commerces = this.commercesSignal.asReadonly();
  readonly commerceCount = computed(() => this.commerces().length);

  private readonly selectedSignal = signal<Commerce | null>(null);
  readonly selected = this.selectedSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private readonly commerceApi: CommerceApi) {
    this.loadCommerces();
  }

  private loadCommerces(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.commerceApi.getCommerces().pipe(takeUntilDestroyed()).subscribe({
      next: list => {
        this.commercesSignal.set(list);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error al cargar comercios'));
        this.loadingSignal.set(false);
      }
    });
  }

  selectCommerce(id: number): void {
    this.loadingSignal.set(true);
    this.commerceApi.getCommerce(id).subscribe({
      next: commerce => {
        this.selectedSignal.set(commerce);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error al cargar comercio'));
        this.loadingSignal.set(false);
      }
    });
  }

  addCommerce(commerce: Commerce): void {
    this.loadingSignal.set(true);
    this.commerceApi.createCommerce(commerce).pipe(retry(2)).subscribe({
      next: created => {
        this.commercesSignal.update(list => [...list, created]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error al crear comercio'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateCommerce(commerce: Commerce): void {
    this.loadingSignal.set(true);
    this.commerceApi.updateCommerce(commerce).pipe(retry(2)).subscribe({
      next: updated => {
        this.commercesSignal.update(list => list.map(c => c.id === updated.id ? updated : c));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error al actualizar comercio'));
        this.loadingSignal.set(false);
      }
    });
  }

  getCommerceById(id: number) {
    return computed(() => this.commerces().find(c => c.id === id));
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) return error.message;
    return fallback;
  }
}
