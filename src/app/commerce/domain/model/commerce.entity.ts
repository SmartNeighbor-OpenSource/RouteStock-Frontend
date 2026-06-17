import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { CommerceType } from './commerce-type.enum';
import { GeoPoint } from './geo-point.value-object';

export class Commerce implements BaseEntity {
  private _id: number;
  private _ownerId: number;
  private _name: string;
  private _address: string;
  private _description: string;
  private _type: CommerceType;
  private _location: GeoPoint;
  private _imageUrl: string | null;

  constructor(props: {
    id: number;
    ownerId: number;
    name: string;
    address: string;
    description: string;
    type: CommerceType;
    location: GeoPoint;
    imageUrl?: string | null;
  }) {
    this._id          = props.id;
    this._ownerId     = props.ownerId;
    this._name        = props.name;
    this._address     = props.address;
    this._description = props.description;
    this._type        = props.type;
    this._location    = props.location;
    this._imageUrl    = props.imageUrl ?? null;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get ownerId(): number { return this._ownerId; }
  set ownerId(value: number) { this._ownerId = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get address(): string { return this._address; }
  set address(value: string) { this._address = value; }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }

  get type(): CommerceType { return this._type; }
  set type(value: CommerceType) { this._type = value; }

  get location(): GeoPoint { return this._location; }
  set location(value: GeoPoint) { this._location = value; }

  get imageUrl(): string | null { return this._imageUrl; }
  set imageUrl(value: string | null) { this._imageUrl = value; }
}
