import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommerceStore } from '../../../application/commerce.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { Commerce } from '../../../domain/model/commerce.entity';
import { CommerceType } from '../../../domain/model/commerce-type.enum';
import { GeoPoint } from '../../../domain/model/geo-point.value-object';

const LIMA_DEFAULT = { lat: -12.0464, lng: -77.0428 };

@Component({
  selector: 'app-new-commerce',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './new-commerce.component.html',
  styleUrl: './new-commerce.component.css',
})
export class NewCommerceComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly commerceStore = inject(CommerceStore);
  private readonly iamStore = inject(IamStore);

  protected readonly types = [
    { value: CommerceType.BODEGA, label: 'Bodega' },
    { value: CommerceType.STREET_VENDOR, label: 'Ambulante' },
    { value: CommerceType.LOCAL_SHOP, label: 'Tienda' },
  ];

  protected locating = false;
  protected locationLabel = 'Usando ubicación por defecto (Lima)';

  protected lat = LIMA_DEFAULT.lat;
  protected lng = LIMA_DEFAULT.lng;

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    type: [CommerceType.BODEGA, [Validators.required]],
  });

  useMyLocation(): void {
    if (!navigator.geolocation) {
      this.locationLabel = 'Geolocalización no disponible en este navegador';
      return;
    }

    this.locating = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.locationLabel = `Ubicación detectada (${this.lat.toFixed(4)}, ${this.lng.toFixed(4)})`;
        this.locating = false;
      },
      () => {
        this.locationLabel = 'No se pudo obtener tu ubicación, se usará Lima por defecto';
        this.locating = false;
      },
      { timeout: 8000 },
    );
  }

  cancel(): void {
    this.router.navigate(['/commerce']);
  }

  save(): void {
    if (this.form.invalid) return;

    const ownerId = this.iamStore.currentUser()?.id;
    if (!ownerId) return;

    const value = this.form.getRawValue();
    const commerce = new Commerce({
      id: Date.now(),
      ownerId,
      name: value.name!,
      address: value.address!,
      description: value.description!,
      type: value.type!,
      location: new GeoPoint({ lat: this.lat, lng: this.lng }),
      imageUrl: null,
    });

    this.commerceStore.addCommerce(commerce);
    this.router.navigate(['/commerce']);
  }
}
