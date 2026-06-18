import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { UsersApiEndpoint } from './users-api-endpoint';
import { User } from '../domain/model/user.entity';
import { Credentials } from '../domain/model/credentials.entity';
import { UserAssembler } from './user-assembler';
import { AuthResponse, UserResource } from './users-response';

import { BaseApi } from '../../shared/infrastructure';
import { environment } from '../../../environments';
import { ProductResource } from '../../catalog/infrastructure/products-response';
import { Product } from '../../catalog/domain/model/product.entity';

@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  private readonly usersEndpoint: UsersApiEndpoint;
  private readonly assembler = new UserAssembler();

  constructor(private readonly http: HttpClient) {
    super();
    this.usersEndpoint = new UsersApiEndpoint(http);
  }

  login(credentials: Credentials): Observable<User> {
    return this.http
      .get<UserResource[]>(`${environment.platformProviderApiBaseUrl}${environment.usersEndpointPath}?email=${credentials.email}&password=${credentials.password}`)
      .pipe(map(users => {
        if (users.length === 0) throw new Error('Credenciales inválidas');
        return this.assembler.toEntityFromResource(users[0]);
      }));
  }

  register(user: User, password: string): Observable<User> {
    return this.http
      .post<UserResource>(
        `${environment.platformProviderApiBaseUrl}${environment.usersEndpointPath}`,
        { name: user.name, email: user.email, password, role: user.role }
      )
      .pipe(map(res => this.assembler.toEntityFromResource(res)));
  }
}
