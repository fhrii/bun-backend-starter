import type { Result } from 'oxide.ts';
import { Query } from '@/lib/cqrs';
import type { Paginated, PaginatedQueryParam } from '@/lib/ddd/repository.port';
import type { BookInvariantException } from '../../domain/book.error';
import type { Book } from '../../domain/entity/book.entity';

export class FindAllPaginatedBookQuery extends Query<
  Result<Paginated<Book>, BookInvariantException | Error>
> {
  constructor(public readonly query: PaginatedQueryParam<Book>) {
    super();
  }
}
