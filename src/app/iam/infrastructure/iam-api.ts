import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseApi } from '../../../shared/infrastructure/base-api';
import { UsersApiEndpoint } from './users-api-endpoint';
import { User } from '../domain/model/user.entity';
import { Credentials } from '../domain/model/credentials.entity';
import { UserAssembler } from './user-assembler';
import { AuthResponse } from './users-response';
import { environment } from '../../../../environments/environment';

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
      .post<AuthResponse>(
        `${environment.platformProviderApiBaseUrl}${environment.authLoginEndpointPath}`,
        { email: credentials.email, password: credentials.password }
      )
      .pipe(map(res => {
        const user = this.assembler.toEntityFromResource(res.user);
        user.token = res.token;
        return user;
      }));
  }

  register(user: User, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(
        `${environment.platformProviderApiBaseUrl}${environment.authRegisterEndpointPath}`,
        { name: user.name, email: user.email, password, role: user.role }
      )
      .pipe(map(res => this.assembler.toEntityFromResource(res.user)));
  }

  getUsers(): Observable<User[]> {
    return this.usersEndpoint.getAll();
  }
}
