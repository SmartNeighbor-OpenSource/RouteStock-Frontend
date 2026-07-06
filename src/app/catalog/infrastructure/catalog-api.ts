import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductsApiEndpoint } from './products-api-endpoint';
import { Product } from '../domain/model/product.entity';
import { BaseApi } from '../../shared/infrastructure';

@Injectable({ providedIn: 'root' })
export class CatalogApi extends BaseApi {
  private readonly productsEndpoint: ProductsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.productsEndpoint = new ProductsApiEndpoint(http);
  }

  searchProducts(name: string): Observable<Product[]>        { return this.productsEndpoint.searchByName(name); }
  getProductsByStore(storeId: number): Observable<Product[]> { return this.productsEndpoint.getByStore(storeId); }
  getProduct(id: number): Observable<Product>   { return this.productsEndpoint.getById(id); }
  createProduct(p: Product): Observable<Product>{ return this.productsEndpoint.create(p); }
  updateProduct(p: Product): Observable<Product>{ return this.productsEndpoint.update(p, p.id); }
  deleteProduct(id: number): Observable<void>   { return this.productsEndpoint.delete(id); }
}
