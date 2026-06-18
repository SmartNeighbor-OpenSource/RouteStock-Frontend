export class CartItem {
  private _productId: number;
  private _commerceId: number;
  private _name: string;
  private _price: number;
  private _quantity: number;
  private _maxStock: number;

  constructor(props: {
    productId: number;
    commerceId: number;
    name: string;
    price: number;
    quantity: number;
    maxStock: number;
  }) {
    this._productId = props.productId;
    this._commerceId = props.commerceId;
    this._name = props.name;
    this._price = props.price;
    this._quantity = props.quantity;
    this._maxStock = props.maxStock;
  }

  get productId(): number {
    return this._productId;
  }
  get commerceId(): number {
    return this._commerceId;
  }
  get name(): string {
    return this._name;
  }
  get price(): number {
    return this._price;
  }
  get quantity(): number {
    return this._quantity;
  }
  set quantity(value: number) {
    this._quantity = value;
  }
  get maxStock(): number {
    return this._maxStock;
  }

  get subtotal(): number {
    return this._price * this._quantity;
  }

  canIncrease(): boolean {
    return this._quantity < this._maxStock;
  }
}
