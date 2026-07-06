import { User } from '../domain/model/user.entity';
import { UserResource, UsersResponse } from './users-response';
import { UserRole } from '../domain/model/user-role.enum';
import { BaseAssembler } from '../../shared/infrastructure';

export class UserAssembler implements BaseAssembler<User, UserResource, UsersResponse> {
  toEntitiesFromResponse(response: UsersResponse): User[] {
    return response.users.map((r) => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: UserResource): User {
    return new User({
      id: resource.id,
      name: resource.fullName,
      email: resource.email,
      role: resource.userType as UserRole,
      token: resource.token ?? null,
    });
  }

  toResourceFromEntity(entity: User): UserResource {
    return {
      id: entity.id,
      fullName: entity.name,
      email: entity.email,
      userType: entity.role,
      token: entity.token ?? undefined,
    } as UserResource;
  }
}
