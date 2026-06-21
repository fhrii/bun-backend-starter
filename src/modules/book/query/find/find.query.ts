import type { Option, Result } from 'oxide.ts';
import { Query } from '@/lib/cqrs';
import type { BookInvariantException } from '../../domain/book.error';
import type { Book } from '../../domain/entity/book.entity';

export class FindBookQuery extends Query<
  Result<Option<Book>, BookInvariantException | Error>
> {
  constructor(public readonly bookId: string) {
    super();
  }
}
