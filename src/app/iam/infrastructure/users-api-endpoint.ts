import { HttpClient } from '@angular/common/http';

import { User } from '../domain/model/user.entity';
import { UserResource, UsersResponse } from './users-response';
import { UserAssembler } from './user-assembler';

import { BaseApiEndpoint } from '../../shared/infrastructure';
import { environment } from '../../../environments';

export class UsersApiEndpoint extends BaseApiEndpoint<User, UserResource, UsersResponse, UserAssembler> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.usersEndpointPath}`,
      new UserAssembler()
    );
  }
}
