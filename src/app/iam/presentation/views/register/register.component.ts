import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { UserRole } from '../../../domain/model/user-role.enum';
import { User } from '../../../domain/model/user.entity';
import { IamStore } from '../../../application/iam.store';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly store = inject(IamStore);

  readonly roles = [
    { value: UserRole.CONSUMER,  label: 'Consumidor — busco productos cercanos' },
    { value: UserRole.MERCHANT,  label: 'Comerciante — tengo una bodega o negocio' }
  ];

  hidePassword = true;

  form: FormGroup = this.fb.group({
    name:     ['', [Validators.required, Validators.minLength(3)]],
    email:    ['', [Validators.required, Validators.email]],
    role:     [UserRole.CONSUMER, Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get isMerchant(): boolean {
    return this.form.get('role')?.value === UserRole.MERCHANT;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { name, email, role, password } = this.form.value;
    const user = new User({ id: 0, name, email, role });
    this.store.register(user, password);
  }
}
