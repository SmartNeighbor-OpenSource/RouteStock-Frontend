import { computed, Injectable, signal } from '@angular/core';
import { retry } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CatalogApi } from '../infrastructure/catalog-api';
import { Product } from '../domain/model/product.entity';
import { SearchFilter } from '../domain/model/search-filter.value-object';

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly productsSignal = signal<Product[]>([]);
  readonly products = this.productsSignal.asReadonly();

  private readonly filterSignal = signal<SearchFilter>(new SearchFilter({ query: '' }));
  readonly filter = this.filterSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly filteredProducts = computed(() => {
    const f = this.filter();
    return this.products().filter((p) => {
      const matchesQuery = !f.query || p.name.toLowerCase().includes(f.query.toLowerCase());
      const matchesCategory = !f.category || p.category.toLowerCase() === f.category.toLowerCase();
      return matchesQuery && matchesCategory;
    });
  });

  readonly categories = computed(() => [...new Set(this.products().map((p) => p.category))]);

  constructor(private readonly catalogApi: CatalogApi) {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi
      .getProducts()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (list) => {
          this.productsSignal.set(list);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Error al cargar productos'));
          this.loadingSignal.set(false);
        },
      });
  }

  applyFilter(filter: SearchFilter): void {
    this.filterSignal.set(filter);
  }

  clearFilter(): void {
    this.filterSignal.set(new SearchFilter({ query: '' }));
  }

  /** Productos de un comercio específico (para la vista "Mi comercio" del merchant) */
  productsByCommerce(commerceId: number) {
    return computed(() => this.products().filter((p) => p.commerceId === commerceId));
  }

  addProduct(product: Product): void {
    this.loadingSignal.set(true);
    this.catalogApi
      .createProduct(product)
      .pipe(retry(2))
      .subscribe({
        next: (created) => {
          this.productsSignal.update((list) => [...list, created]);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Error al crear producto'));
          this.loadingSignal.set(false);
        },
      });
  }

  updateProduct(product: Product): void {
    this.loadingSignal.set(true);
    this.catalogApi
      .updateProduct(product)
      .pipe(retry(2))
      .subscribe({
        next: (updated) => {
          this.productsSignal.update((list) =>
            list.map((p) => (p.id === updated.id ? updated : p)),
          );
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Error al actualizar producto'));
          this.loadingSignal.set(false);
        },
      });
  }

  deleteProduct(id: number): void {
    this.loadingSignal.set(true);
    this.catalogApi.deleteProduct(id).subscribe({
      next: () => {
        this.productsSignal.update((list) => list.filter((p) => p.id !== id));
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Error al eliminar producto'));
        this.loadingSignal.set(false);
      },
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) return error.message;
    return fallback;
  }
}
