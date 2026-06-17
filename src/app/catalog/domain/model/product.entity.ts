import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Product implements BaseEntity {
  private _id: number;
  private _commerceId: number;
  private _name: string;
  private _category: string;
  private _price: number;
  private _stock: number;
  private _imageUrl: string | null;

  constructor(props: {
    id: number;
    commerceId: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    imageUrl?: string | null;
  }) {
    this._id         = props.id;
    this._commerceId = props.commerceId;
    this._name       = props.name;
    this._category   = props.category;
    this._price      = props.price;
    this._stock      = props.stock;
    this._imageUrl   = props.imageUrl ?? null;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get commerceId(): number { return this._commerceId; }
  set commerceId(value: number) { this._commerceId = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get category(): string { return this._category; }
  set category(value: string) { this._category = value; }

  get price(): number { return this._price; }
  set price(value: number) { this._price = value; }

  get stock(): number { return this._stock; }
  set stock(value: number) { this._stock = value; }

  get imageUrl(): string | null { return this._imageUrl; }
  set imageUrl(value: string | null) { this._imageUrl = value; }

  isAvailable(): boolean { return this._stock > 0; }
}
