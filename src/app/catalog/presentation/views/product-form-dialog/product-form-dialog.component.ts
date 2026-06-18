import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../domain/model/product.entity';

export interface ProductFormDialogData {
  commerceId: number;
  product?: Product;
}

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './product-form-dialog.component.html',
  styleUrl: './product-form-dialog.component.css',
})
export class ProductFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ProductFormDialogComponent>);
  protected readonly data = inject<ProductFormDialogData>(MAT_DIALOG_DATA);

  protected readonly isEdit = !!this.data.product;

  protected readonly form = this.fb.group({
    name: [this.data.product?.name ?? '', [Validators.required, Validators.minLength(2)]],
    category: [this.data.product?.category ?? '', [Validators.required]],
    price: [this.data.product?.price ?? null, [Validators.required, Validators.min(0.01)]],
    stock: [this.data.product?.stock ?? null, [Validators.required, Validators.min(0)]],
  });

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    const product = new Product({
      id: this.data.product?.id ?? Date.now(),
      commerceId: this.data.commerceId,
      name: value.name!,
      category: value.category!,
      price: value.price!,
      stock: value.stock!,
      imageUrl: this.data.product?.imageUrl ?? null,
    });

    this.dialogRef.close(product);
  }
}
