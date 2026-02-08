import type { Option, Result } from 'oxide.ts';
import type { InvariantException } from '../exceptions';
import type { AggregateID } from './entity.base';

export class Paginated<T> {
  constructor(
    public readonly count: number,
    public readonly limit: number,
    public readonly page: number,
    public readonly data: readonly T[],
  ) {}
}

export interface OrderBy {
  field: string;
  param: 'asc' | 'desc';
}

export interface PaginatedQueryParams {
  limit: number;
  page: number;
  orderBy: OrderBy;
}

export interface RepositoryPort<Entity> {
  insert: (entity: Entity) => Promise<Result<void, Error>>;
  update: (entity: Entity) => Promise<Result<boolean, Error>>;
  delete: (entity: Entity) => Promise<Result<boolean, Error>>;
  find: (
    id: AggregateID,
  ) => Promise<Result<Option<Entity>, InvariantException | Error>>;
  findAll: () => Promise<Result<Entity[], InvariantException | Error>>;
  findAllPaginated: (
    query: PaginatedQueryParams,
  ) => Promise<Result<Paginated<Entity>, InvariantException | Error>>;
}
