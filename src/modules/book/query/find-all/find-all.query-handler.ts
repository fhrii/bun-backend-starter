import type { Result } from 'oxide.ts';
import { inject, injectable } from 'tsyringe';
import type { IQueryHandler } from '@/lib/cqrs';
import { BOOK_REPOSITORY_TOKEN } from '../../book.token';
import type { BookInvariantException } from '../../domain/book.error';
import type { Book } from '../../domain/entity/book.entity';
import type { BookRepository } from '../../repository/book.repository';
import type { FindAllBookQuery } from './find-all.query';

@injectable()
export class FindAllBookQueryHandler implements IQueryHandler<FindAllBookQuery> {
  constructor(
    @inject(BOOK_REPOSITORY_TOKEN)
    private readonly bookRepository: BookRepository,
  ) {}

  async execute(
    query: FindAllBookQuery,
  ): Promise<Result<Book[], BookInvariantException | Error>> {
    return this.bookRepository.findAll(query.query);
  }
}
