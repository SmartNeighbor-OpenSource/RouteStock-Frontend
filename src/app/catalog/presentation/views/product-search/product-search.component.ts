import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CatalogStore } from '../../../application/catalog.store';
import { SearchFilter } from '../../../domain/model/search-filter.value-object';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.css'
})
export class ProductSearchComponent {
  protected readonly store = inject(CatalogStore);

  searchControl    = new FormControl('');
  categoryControl  = new FormControl<string | null>(null);

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(() => this.applyFilter());

    this.categoryControl.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe(() => this.applyFilter());
  }

  private applyFilter(): void {
    this.store.applyFilter(new SearchFilter({
      query:    this.searchControl.value ?? '',
      category: this.categoryControl.value
    }));
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue(null);
    this.store.clearFilter();
  }
}
