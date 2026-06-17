import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Commerce } from '../domain/model/commerce.entity';
import { CommerceResource, CommercesResponse } from './commerces-response';
import { CommerceAssembler } from './commerce-assembler';
import { environment } from '../../../../environments/environment';

export class CommercesApiEndpoint extends BaseApiEndpoint<Commerce, CommerceResource, CommercesResponse, CommerceAssembler> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.commercesEndpointPath}`,
      new CommerceAssembler()
    );
  }
}
