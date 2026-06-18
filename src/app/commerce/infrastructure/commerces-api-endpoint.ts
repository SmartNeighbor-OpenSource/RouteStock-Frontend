import { HttpClient } from '@angular/common/http';


import { CommerceResource, CommercesResponse } from './commerces-response';
import { CommerceAssembler } from './commerce-assembler';
import { BaseApiEndpoint } from '../../shared/infrastructure';
import { environment } from '../../../environments';
import { Commerce } from '../domain/model';


export class CommercesApiEndpoint extends BaseApiEndpoint<Commerce, CommerceResource, CommercesResponse, CommerceAssembler> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.commercesEndpointPath}`,
      new CommerceAssembler()
    );
  }
}
