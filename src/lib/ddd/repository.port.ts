import type { Option, Result } from 'oxide.ts';
import type { InvariantException } from '../exceptions';
import type { AggregateID, Entity } from './entity.base';

export class Paginated<T> {
  constructor(
    public readonly count: number,
    public readonly limit: number,
    public readonly page: number,
    public readonly data: readonly T[],
  ) {}
}

export interface OrderBy<TEntity extends Entity<any>> {
  field: keyof TEntity['props'];
  param: 'asc' | 'desc';
}

export interface PaginatedQueryParams<TEntity extends Entity<any>> {
  limit: number;
  page: number;
  orderBy: OrderBy<TEntity>[];
}

export interface RepositoryPort<
  TEntity extends Entity<any>,
  TInvariantException extends InvariantException,
> {
  insert: (entity: TEntity) => Promise<Result<TEntity, Error>>;
  update: (entity: TEntity) => Promise<Result<Option<TEntity>, Error>>;
  delete: (entity: TEntity) => Promise<Result<Option<TEntity>, Error>>;
  find: (
    id: AggregateID,
  ) => Promise<Result<Option<TEntity>, TInvariantException | Error>>;
  findAll: () => Promise<Result<TEntity[], TInvariantException | Error>>;
  findAllPaginated: (
    query: PaginatedQueryParams<TEntity>,
  ) => Promise<Result<Paginated<TEntity>, TInvariantException | Error>>;
}
