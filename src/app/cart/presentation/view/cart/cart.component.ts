import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { CartStore } from '../../../application/cart.store';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, DecimalPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  protected readonly cartStore = inject(CartStore);
  private readonly router = inject(Router);

  protected purchaseSuccess = false;

  increase(productId: number): void {
    this.cartStore.increaseQuantity(productId);
  }

  decrease(productId: number): void {
    this.cartStore.decreaseQuantity(productId);
  }

  remove(productId: number): void {
    this.cartStore.removeItem(productId);
  }

  goShopping(): void {
    this.router.navigate(['/search']);
  }

  confirmPurchase(): void {
    this.cartStore.checkout(() => {
      this.purchaseSuccess = true;
    });
  }

  backToShopping(): void {
    this.purchaseSuccess = false;
    this.router.navigate(['/search']);
  }
}
