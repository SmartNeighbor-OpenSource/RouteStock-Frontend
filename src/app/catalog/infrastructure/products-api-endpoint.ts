import { HttpClient } from '@angular/common/http';

import { Product } from '../domain/model/product.entity';
import { ProductResource, ProductsResponse } from './products-response';
import { ProductAssembler } from './product-assembler';
import { BaseApiEndpoint } from '../../shared/infrastructure';
import { environment } from '../../../environments';


export class ProductsApiEndpoint extends BaseApiEndpoint<Product, ProductResource, ProductsResponse, ProductAssembler> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.productsEndpointPath}`,
      new ProductAssembler()
    );
  }
}
