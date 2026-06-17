import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Product } from '../domain/model/product.entity';
import { ProductResource, ProductsResponse } from './products-response';
import { ProductAssembler } from './product-assembler';
import { environment } from '../../../../environments/environment';

export class ProductsApiEndpoint extends BaseApiEndpoint<Product, ProductResource, ProductsResponse, ProductAssembler> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.productsEndpointPath}`,
      new ProductAssembler()
    );
  }
}
