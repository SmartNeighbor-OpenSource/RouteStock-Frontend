import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Product } from '../domain/model/product.entity';
import { ProductResource, ProductsResponse } from './products-response';

export class ProductAssembler implements BaseAssembler<Product, ProductResource, ProductsResponse> {

  toEntitiesFromResponse(response: ProductsResponse): Product[] {
    return response.products.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: ProductResource): Product {
    return new Product({
      id:         resource.id,
      commerceId: resource.commerceId,
      name:       resource.name,
      category:   resource.category,
      price:      resource.price,
      stock:      resource.stock,
      imageUrl:   resource.imageUrl ?? null
    });
  }

  toResourceFromEntity(entity: Product): ProductResource {
    return {
      id:         entity.id,
      commerceId: entity.commerceId,
      name:       entity.name,
      category:   entity.category,
      price:      entity.price,
      stock:      entity.stock,
      imageUrl:   entity.imageUrl ?? undefined
    } as ProductResource;
  }
}
