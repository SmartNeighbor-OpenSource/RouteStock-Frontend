import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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

  /** GET /api/v1/products?name=... — búsqueda de productos disponibles por nombre (consumidor). */
  searchByName(name: string): Observable<Product[]> {
    return this.http
      .get<ProductResource[]>(this.resourceUrl, { params: new HttpParams().set('name', name) })
      .pipe(map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))));
  }

  /** GET /api/v1/products?storeId=... — inventario de un comercio (merchant / detalle de comercio). */
  getByStore(storeId: number): Observable<Product[]> {
    return this.http
      .get<ProductResource[]>(this.resourceUrl, { params: new HttpParams().set('storeId', storeId) })
      .pipe(map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))));
  }
}
