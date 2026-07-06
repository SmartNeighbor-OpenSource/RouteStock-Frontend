import { CommerceResource, CommercesResponse } from './commerces-response';
import { BaseAssembler } from '../../shared/infrastructure';
import { Commerce, CommerceType, GeoPoint } from '../domain/model';

const STORE_TYPE_TO_BACKEND: Record<string, string> = {
  BODEGA: 'BODEGA',
  AMBULANTE: 'STREET_VENDOR',
  TIENDA: 'LOCAL_SHOP',
};

const STORE_TYPE_FROM_BACKEND: Record<string, string> = {
  BODEGA: 'BODEGA',
  STREET_VENDOR: 'AMBULANTE',
  LOCAL_SHOP: 'TIENDA',
};

export class CommerceAssembler implements BaseAssembler<
  Commerce,
  CommerceResource,
  CommercesResponse
> {
  toEntitiesFromResponse(response: CommercesResponse): Commerce[] {
    return response.commerces.map((r) => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: CommerceResource): Commerce {
    return new Commerce({
      id: resource.id,
      ownerId: resource.merchantId,
      name: resource.name,
      address: resource.address,
      description: '',
      type: (STORE_TYPE_FROM_BACKEND[resource.storeType] ?? resource.storeType) as CommerceType,
      location: new GeoPoint({ lat: resource.latitude, lng: resource.longitude }),
      imageUrl: null,
    });
  }

  toResourceFromEntity(entity: Commerce): CommerceResource {
    return {
      id: entity.id,
      merchantId: entity.ownerId,
      name: entity.name,
      address: entity.address,
      storeType: STORE_TYPE_TO_BACKEND[entity.type] ?? entity.type,
      latitude: entity.location.lat,
      longitude: entity.location.lng,
    } as CommerceResource;
  }
}
