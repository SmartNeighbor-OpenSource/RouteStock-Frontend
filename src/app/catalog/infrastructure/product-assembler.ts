import { Product } from '../domain/model/product.entity';
import { ProductResource, ProductsResponse } from './products-response';
import { BaseAssembler } from '../../shared/infrastructure';

export class ProductAssembler implements BaseAssembler<Product, ProductResource, ProductsResponse> {
  toEntitiesFromResponse(response: ProductsResponse): Product[] {
    return response.products.map((r) => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: ProductResource): Product {
    return new Product({
      id: resource.id,
      commerceId: resource.storeId,
      name: resource.name,
      category: resource.description ?? '',
      price: resource.price,
      stock: resource.stock,
      imageUrl: null,
    });
  }

  toResourceFromEntity(entity: Product): ProductResource {
    return {
      id: entity.id,
      storeId: entity.commerceId,
      name: entity.name,
      description: entity.category,
      price: entity.price,
      currency: 'PEN',
      stock: entity.stock,
    } as ProductResource;
  }
}
