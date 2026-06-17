import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';

export interface CommerceResource extends BaseResource {
  id: number;
  ownerId: number;
  name: string;
  address: string;
  description: string;
  type: string;
  lat: number;
  lng: number;
  imageUrl?: string;
}

export interface CommercesResponse extends BaseResponse {
  commerces: CommerceResource[];
}
