import { BaseResource, BaseResponse } from '../../shared/infrastructure';

export interface ProductResource extends BaseResource {
  id: number;
  storeId: number;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  stock: number;
  availability?: string;
}

export interface ProductsResponse extends BaseResponse {
  products: ProductResource[];
}
