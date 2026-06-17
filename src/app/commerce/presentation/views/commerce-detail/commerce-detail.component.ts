import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CommerceStore } from '../../../application/commerce.store';

@Component({
  selector: 'app-commerce-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './commerce-detail.component.html',
  styleUrl: './commerce-detail.component.css'
})
export class CommerceDetailComponent implements OnInit {
  protected readonly store = inject(CommerceStore);
  private readonly route  = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.store.selectCommerce(id);
  }
}
