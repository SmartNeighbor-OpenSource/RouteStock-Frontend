import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseEntity } from '../domain/model/base-entity';
import { BaseResource, BaseResponse } from './base-response';
import { BaseAssembler } from './base-assembler';

export abstract class BaseApiEndpoint<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TResponse extends BaseResponse,
  TAssembler extends BaseAssembler<TEntity, TResource, TResponse>,
> {
  protected constructor(
    protected readonly http: HttpClient,
    protected readonly resourceUrl: string,
    protected readonly assembler: TAssembler,
  ) {}

  getAll(): Observable<TEntity[]> {
    return this.http
      .get<TResource[]>(this.resourceUrl)
      .pipe(map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))));
  }

  getById(id: number | string): Observable<TEntity> {
    return this.http
      .get<TResource>(`${this.resourceUrl}/${id}`)
      .pipe(map((resource) => this.assembler.toEntityFromResource(resource)));
  }

  create(entity: TEntity): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http
      .post<TResource>(this.resourceUrl, resource)
      .pipe(map((r) => this.assembler.toEntityFromResource(r)));
  }

  update(entity: TEntity, id: number | string): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http
      .put<TResource>(`${this.resourceUrl}/${id}`, resource)
      .pipe(map((r) => this.assembler.toEntityFromResource(r)));
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}
