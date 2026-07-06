import { BaseResource, BaseResponse } from '../../shared/infrastructure';

export interface UserResource extends BaseResource {
  id: number;
  fullName: string;
  email: string;
  userType: string;
  token?: string;
}

export interface UsersResponse extends BaseResponse {
  users: UserResource[];
}

export interface AuthResponse {
  token: string;
  user: UserResource;
}
