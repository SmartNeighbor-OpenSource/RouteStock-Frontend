import { computed, Injectable, signal } from '@angular/core';
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
    return this.products().filter(p => {
      const matchesQuery    = !f.query    || p.name.toLowerCase().includes(f.query.toLowerCase());
      const matchesCategory = !f.category || p.category.toLowerCase() === f.category.toLowerCase();
      return matchesQuery && matchesCategory;
    });
  });

  readonly categories = computed(() =>
    [...new Set(this.products().map(p => p.category))]
  );

  constructor(private readonly catalogApi: CatalogApi) {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.getProducts().pipe(takeUntilDestroyed()).subscribe({
      next: list => {
        this.productsSignal.set(list);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error al cargar productos'));
        this.loadingSignal.set(false);
      }
    });
  }

  applyFilter(filter: SearchFilter): void {
    this.filterSignal.set(filter);
  }

  clearFilter(): void {
    this.filterSignal.set(new SearchFilter({ query: '' }));
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) return error.message;
    return fallback;
  }
}
