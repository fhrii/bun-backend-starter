import type { Result } from 'oxide.ts';
import { Query } from '@/lib/cqrs';
import type { QueryParam } from '@/lib/ddd/repository.port';
import type { BookInvariantException } from '../../domain/book.error';
import type { Book } from '../../domain/entity/book.entity';

export class FindAllBookQuery extends Query<
  Result<Book[], BookInvariantException | Error>
> {
  constructor(public readonly query: QueryParam<Book>) {
    super();
  }
}
