import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { IamStore } from '../../../application/iam.store';
import { UserRole } from '../../../domain/model/user-role.enum';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatDividerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  protected readonly store = inject(IamStore);
  private readonly router = inject(Router);

  protected roleLabel(role: UserRole | undefined): string {
    if (role === UserRole.MERCHANT) return 'Comerciante';
    if (role === UserRole.CONSUMER) return 'Consumidor';
    return 'Sin rol';
  }

  goBack(): void {
    this.router.navigate(['/search']);
  }

  logout(): void {
    this.store.logout();
  }
}
