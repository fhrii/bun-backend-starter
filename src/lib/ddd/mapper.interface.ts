import type { Result } from 'oxide.ts';
import type { InvariantException } from '../exceptions';
import type { Entity } from './entity.base';
import type { Paginated } from './repository.port';

export interface PaginatedResponse<TResponse> {
  data: TResponse[];
  metadata: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

export interface Mapper<
  DomainEntity extends Entity<any>,
  DbRecord,
  Response = any,
> {
  toPersistence: (entity: DomainEntity) => Result<DbRecord, never>;
  toDomain: (
    record: Record<string, any>,
  ) => Result<DomainEntity, InvariantException>;
  toResponse: (entity: DomainEntity) => Result<Response, never>;
  toPaginatedResponse: (
    paginated: Paginated<DomainEntity>,
  ) => Result<PaginatedResponse<Response>, never>;
}
