import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { User } from '../domain/model/user.entity';
import { UserResource, UsersResponse } from './users-response';
import { UserRole } from '../domain/model/user-role.enum';

export class UserAssembler implements BaseAssembler<User, UserResource, UsersResponse> {

  toEntitiesFromResponse(response: UsersResponse): User[] {
    return response.users.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: UserResource): User {
    return new User({
      id: resource.id,
      name: resource.name,
      email: resource.email,
      role: resource.role as UserRole,
      token: resource.token ?? null
    });
  }

  toResourceFromEntity(entity: User): UserResource {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      token: entity.token ?? undefined
    } as UserResource;
  }
}
