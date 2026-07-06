import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CatalogStore } from '../../../application/catalog.store';
import { CommerceStore } from '../../../../commerce/application/commerce.store';
import { Product } from '../../../domain/model/product.entity';
import { ProductFormDialogComponent } from '../product-form-dialog/product-form-dialog.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-my-commerce-products',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, DecimalPipe],
  templateUrl: './my-commerce-products.component.html',
  styleUrl: './my-commerce-products.component.css',
})
export class MyCommerceProductsComponent implements OnInit {
  protected readonly catalogStore = inject(CatalogStore);
  protected readonly commerceStore = inject(CommerceStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected commerceId = 0;

  protected readonly commerce = computed(() =>
    this.commerceStore.commerces().find((c) => c.id === this.commerceId),
  );

  protected readonly products = computed(() =>
    this.catalogStore.products().filter((p) => p.commerceId === this.commerceId),
  );

  ngOnInit(): void {
    this.commerceId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.commerceId) this.catalogStore.loadProductsByCommerce(this.commerceId);
  }

  goBack(): void {
    this.router.navigate(['/commerce']);
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(ProductFormDialogComponent, {
      width: '480px',
      data: { commerceId: this.commerceId },
    });
    ref.afterClosed().subscribe((result: Product | undefined) => {
      if (result) this.catalogStore.addProduct(result);
    });
  }

  openEditDialog(product: Product): void {
    const ref = this.dialog.open(ProductFormDialogComponent, {
      width: '480px',
      data: { commerceId: this.commerceId, product },
    });
    ref.afterClosed().subscribe((result: Product | undefined) => {
      if (result) this.catalogStore.updateProduct(result);
    });
  }

  deleteProduct(product: Product): void {
    if (confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      this.catalogStore.deleteProduct(product.id);
    }
  }
}
