import type { RepositoryPort } from '@/lib/ddd/repository.port';
import type { BookInvariantException } from '../domain/book.error';
import type { Book } from '../domain/entity/book.entity';

export interface BookRepository extends RepositoryPort<
  Book,
  BookInvariantException
> {}
