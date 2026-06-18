import { BaseResource, BaseResponse } from '../../shared/infrastructure';


export interface ProductResource extends BaseResource {
  id: number;
  commerceId: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface ProductsResponse extends BaseResponse {
  products: ProductResource[];
}
