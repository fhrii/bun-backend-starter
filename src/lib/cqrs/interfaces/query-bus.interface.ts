import type { Query } from './query';
import type { IQueryHandler } from './query-handler.interface';

export type QueryHandlerType<
  T extends Query<TResult>,
  TResult = unknown,
> = new (...args: unknown[]) => IQueryHandler<T, TResult>;

type QueryClass<QueryBase extends Query = Query> = new (
  ...args: unknown[]
) => QueryBase;

export interface IQueryBus<QueryBase extends Query = Query> {
  execute: <TResult = unknown>(query: QueryBase) => Promise<TResult>;
  register: (
    queryClass: QueryClass<QueryBase>,
    handlerClass: QueryHandlerType<QueryBase>,
  ) => void;
}
