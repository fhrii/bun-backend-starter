import type { Option, Result } from 'oxide.ts';
import { inject, injectable } from 'tsyringe';
import type { IQueryHandler } from '@/lib/cqrs';
import { BOOK_REPOSITORY_TOKEN } from '../../book.token';
import type { BookInvariantException } from '../../domain/book.error';
import type { Book } from '../../domain/entity/book.entity';
import type { BookRepository } from '../../repository/book.repository';
import { FindBookQuery } from './find.query';

@injectable()
export class FindBookQueryHandler implements IQueryHandler<FindBookQuery> {
  constructor(
    @inject(BOOK_REPOSITORY_TOKEN)
    private readonly bookRepository: BookRepository,
  ) {}

  async execute(
    query: FindBookQuery,
  ): Promise<Result<Option<Book>, BookInvariantException | Error>> {
    return this.bookRepository.find(query.bookId);
  }
}
