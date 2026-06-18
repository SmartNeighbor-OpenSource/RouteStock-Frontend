import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { DecimalPipe } from '@angular/common';
import { CommerceStore } from '../../../application/commerce.store';
import { CatalogStore } from '../../../../catalog/application/catalog.store';

@Component({
  selector: 'app-commerce-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    DecimalPipe,
  ],
  templateUrl: './commerce-detail.component.html',
  styleUrl: './commerce-detail.component.css',
})
export class CommerceDetailComponent implements OnInit {
  protected readonly store = inject(CommerceStore);
  protected readonly catalogStore = inject(CatalogStore);
  private readonly route = inject(ActivatedRoute);

  private commerceId = 0;
  protected focusedProductId: number | null = null;

  /** Si se vino desde un producto específico, muestra solo ese; si no, muestra todos */
  protected readonly products = computed(() => {
    const all = this.catalogStore.products().filter((p) => p.commerceId === this.commerceId);
    if (this.focusedProductId == null) return all;
    return all.filter((p) => p.id === this.focusedProductId);
  });

  ngOnInit(): void {
    this.commerceId = Number(this.route.snapshot.paramMap.get('id'));
    const productIdParam = this.route.snapshot.queryParamMap.get('productId');
    this.focusedProductId = productIdParam ? Number(productIdParam) : null;

    if (this.commerceId) this.store.selectCommerce(this.commerceId);
  }
}
