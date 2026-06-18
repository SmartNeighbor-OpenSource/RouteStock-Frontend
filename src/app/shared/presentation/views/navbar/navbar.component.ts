import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IamStore } from '../../../../iam/application/iam.store';
import { CartStore } from '../../../../cart/application/cart.store';
import { NavItem } from '../../../domain/model/nav-item.model';
import { UserRole } from '../../../../iam/domain/model/user-role.enum';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  protected readonly store = inject(IamStore);
  protected readonly cartStore = inject(CartStore);
  private readonly bp = inject(BreakpointObserver);

  readonly isMobile = toSignal(this.bp.observe([Breakpoints.Handset]).pipe(map((r) => r.matches)), {
    initialValue: false,
  });

  sidenavOpen = false;

  readonly navItems: NavItem[] = [
    new NavItem({ label: 'Buscar productos', route: '/search', icon: 'search', roles: [] }),
    new NavItem({
      label: 'Mi comercio',
      route: '/commerce',
      icon: 'store',
      roles: [UserRole.MERCHANT],
    }),
  ];

  get visibleItems(): NavItem[] {
    const role = this.store.currentUser()?.role ?? null;
    return this.navItems.filter((item) => item.isVisibleFor(role));
  }

  logout(): void {
    this.sidenavOpen = false;
    this.store.logout();
  }
}
