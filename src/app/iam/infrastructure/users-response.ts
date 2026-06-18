import { BaseResource, BaseResponse } from '../../shared/infrastructure';


export interface UserResource extends BaseResource {
  id: number;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export interface UsersResponse extends BaseResponse {
  users: UserResource[];
}

export interface AuthResponse {
  token: string;
  user: UserResource;
}
