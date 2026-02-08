import type { Query } from '../query';

export interface IQueryHandler<
  TQuery extends Query<TResult>,
  TResult = TQuery['RESULT_QUERY_SYMBOL'],
> {
  execute: (query: TQuery) => Promise<TResult>;
}
