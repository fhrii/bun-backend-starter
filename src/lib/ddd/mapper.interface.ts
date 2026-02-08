/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Result } from 'oxide.ts';
import type { InvariantException } from '../exceptions';
import type { Entity } from './entity.base';

export interface Mapper<
  DomainEntity extends Entity<any>,
  DbRecord,
  Response = any,
> {
  toPersistence: (entity: DomainEntity) => Result<DbRecord, never>;
  toDomain: (
    record: Record<string, unknown>,
  ) => Result<DomainEntity, InvariantException>;
  toResponse: (entity: DomainEntity) => Result<Response, never>;
}
