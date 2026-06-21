import type { Result } from 'oxide.ts';
import { inject, injectable } from 'tsyringe';
import type { IQueryHandler } from '@/lib/cqrs';
import type { Paginated } from '@/lib/ddd/repository.port';
import { BOOK_REPOSITORY_TOKEN } from '../../book.token';
import type { BookInvariantException } from '../../domain/book.error';
import type { Book } from '../../domain/entity/book.entity';
import type { BookRepository } from '../../repository/book.repository';
import type { FindAllPaginatedBookQuery } from './find-all-paginated.query';

@injectable()
export class FindAllPaginatedBookQueryHandler implements IQueryHandler<FindAllPaginatedBookQuery> {
  constructor(
    @inject(BOOK_REPOSITORY_TOKEN)
    private readonly bookRepository: BookRepository,
  ) {}

  async execute(
    query: FindAllPaginatedBookQuery,
  ): Promise<Result<Paginated<Book>, BookInvariantException | Error>> {
    return this.bookRepository.findAllPaginated(query.query);
  }
}
