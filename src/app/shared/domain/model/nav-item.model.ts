import { UserRole } from '../../../iam/domain/model/user-role.enum';

export class NavItem {
  private _label: string;
  private _route: string;
  private _icon: string;
  private _roles: UserRole[];

  constructor(props: {
    label: string;
    route: string;
    icon: string;
    roles?: UserRole[];
  }) {
    this._label = props.label;
    this._route = props.route;
    this._icon  = props.icon;
    this._roles = props.roles ?? [];
  }

  get label(): string { return this._label; }
  get route(): string { return this._route; }
  get icon():  string { return this._icon; }
  get roles(): UserRole[] { return this._roles; }

  isVisibleFor(role: UserRole | null): boolean {
    if (this._roles.length === 0) return true;
    if (!role) return false;
    return this._roles.includes(role);
  }
}
