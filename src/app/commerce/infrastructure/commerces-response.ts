import { BaseResource, BaseResponse } from '../../shared/infrastructure';

export interface CommerceResource extends BaseResource {
  id: number;
  merchantId: number;
  name: string;
  address: string;
  storeType: string;
  latitude: number;
  longitude: number;
  ratingAverage?: number;
  ratingReviewsCount?: number;
}

export interface CommercesResponse extends BaseResponse {
  commerces: CommerceResource[];
}
