import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { UserRole } from './user-role.enum';

export class User implements BaseEntity {
  private _id: number;
  private _name: string;
  private _email: string;
  private _role: UserRole;
  private _token: string | null;

  constructor(props: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    token?: string | null;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._role = props.role;
    this._token = props.token ?? null;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get role(): UserRole { return this._role; }
  set role(value: UserRole) { this._role = value; }

  get token(): string | null { return this._token; }
  set token(value: string | null) { this._token = value; }

  isMerchant(): boolean { return this._role === UserRole.MERCHANT; }
  isConsumer(): boolean { return this._role === UserRole.CONSUMER; }
}
