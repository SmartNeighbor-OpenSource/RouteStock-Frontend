import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { UsersApiEndpoint } from './users-api-endpoint';
import { User } from '../domain/model/user.entity';
import { Credentials } from '../domain/model/credentials.entity';
import { UserAssembler } from './user-assembler';
import { UserResource } from './users-response';

import { BaseApi } from '../../shared/infrastructure';
import { environment } from '../../../environments';

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
      .post<UserResource>(
        `${environment.platformProviderApiBaseUrl}${environment.authenticationEndpointPath}/sign-in`,
        { email: credentials.email, password: credentials.password },
      )
      .pipe(map((res) => this.assembler.toEntityFromResource(res)));
  }

  register(user: User, password: string): Observable<User> {
    const [firstName, ...rest] = user.name.trim().split(' ');
    const lastName = rest.join(' ') || firstName;

    return this.http
      .post<UserResource>(
        `${environment.platformProviderApiBaseUrl}${environment.authenticationEndpointPath}/sign-up`,
        {
          firstName,
          lastName,
          email: user.email,
          password,
          userType: user.role,
        },
      )
      .pipe(map((res) => this.assembler.toEntityFromResource(res)));
  }
}
