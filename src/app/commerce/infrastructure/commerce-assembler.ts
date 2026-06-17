import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Commerce } from '../domain/model/commerce.entity';
import { CommerceResource, CommercesResponse } from './commerces-response';
import { CommerceType } from '../domain/model/commerce-type.enum';
import { GeoPoint } from '../domain/model/geo-point.value-object';

export class CommerceAssembler implements BaseAssembler<Commerce, CommerceResource, CommercesResponse> {

  toEntitiesFromResponse(response: CommercesResponse): Commerce[] {
    return response.commerces.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: CommerceResource): Commerce {
    return new Commerce({
      id:          resource.id,
      ownerId:     resource.ownerId,
      name:        resource.name,
      address:     resource.address,
      description: resource.description,
      type:        resource.type as CommerceType,
      location:    new GeoPoint({ lat: resource.lat, lng: resource.lng }),
      imageUrl:    resource.imageUrl ?? null
    });
  }

  toResourceFromEntity(entity: Commerce): CommerceResource {
    return {
      id:          entity.id,
      ownerId:     entity.ownerId,
      name:        entity.name,
      address:     entity.address,
      description: entity.description,
      type:        entity.type,
      lat:         entity.location.lat,
      lng:         entity.location.lng,
      imageUrl:    entity.imageUrl ?? undefined
    } as CommerceResource;
  }
}
