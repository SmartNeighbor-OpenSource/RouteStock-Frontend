import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CommercesApiEndpoint } from './commerces-api-endpoint';
import { Commerce } from '../domain/model';
import { BaseApi } from '../../shared/infrastructure';


@Injectable({ providedIn: 'root' })
export class CommerceApi extends BaseApi {
  private readonly commercesEndpoint: CommercesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.commercesEndpoint = new CommercesApiEndpoint(http);
  }

  getCommerces(): Observable<Commerce[]> { return this.commercesEndpoint.getAll(); }
  getCommerce(id: number): Observable<Commerce> { return this.commercesEndpoint.getById(id); }
  createCommerce(c: Commerce): Observable<Commerce> { return this.commercesEndpoint.create(c); }
  updateCommerce(c: Commerce): Observable<Commerce> { return this.commercesEndpoint.update(c, c.id); }
  deleteCommerce(id: number): Observable<void> { return this.commercesEndpoint.delete(id); }
}
