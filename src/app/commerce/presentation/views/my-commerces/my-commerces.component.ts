import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommerceStore } from '../../../application/commerce.store';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-my-commerces',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './my-commerces.component.html',
  styleUrl: './my-commerces.component.css',
})
export class MyCommercesComponent implements OnInit {
  protected readonly commerceStore = inject(CommerceStore);
  protected readonly iamStore = inject(IamStore);
  private readonly router = inject(Router);

  protected readonly myCommerces = computed(() => {
    const userId = this.iamStore.currentUser()?.id;
    if (!userId) return [];
    return this.commerceStore.commerces().filter((c) => c.ownerId === userId);
  });

  ngOnInit(): void {
    // CommerceStore ya carga la lista en su constructor
  }

  openProducts(commerceId: number): void {
    this.router.navigate(['/commerce', commerceId, 'products']);
  }

  createCommerce(): void {
    this.router.navigate(['/commerce', 'new']);
  }
}
