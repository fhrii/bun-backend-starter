import './repository/book.repository-implementation';
import { Module } from '@/lib/module';
import { bookRouter } from './book.router';
import { CreateBookCommand } from './command/create-book/create-book.command';
import { CreateBookCommandHandler } from './command/create-book/create-book.command-handler';
import { DeleteBookCommand } from './command/delete-book/delete-book.command';
import { DeleteBookCommandHandler } from './command/delete-book/delete-book.command-handler';
import { UpdateBookCommand } from './command/update-book/update-book.command';
import { UpdateBookCommandHandler } from './command/update-book/update-book.command-handler';
import { FindBookQuery } from './query/find/find.query';
import { FindBookQueryHandler } from './query/find/find.query-handler';
import { FindAllBookQuery } from './query/find-all/find-all.query';
import { FindAllBookQueryHandler } from './query/find-all/find-all.query-handler';
import { FindAllPaginatedBookQuery } from './query/find-all-paginated/find-all-paginated.query';
import { FindAllPaginatedBookQueryHandler } from './query/find-all-paginated/find-all-paginated.query-handler';

export class BookModule extends Module {
  constructor() {
    super({
      router: bookRouter,
      commands: [
        [CreateBookCommand, CreateBookCommandHandler],
        [UpdateBookCommand, UpdateBookCommandHandler],
        [DeleteBookCommand, DeleteBookCommandHandler],
      ],
      queries: [
        [FindBookQuery, FindBookQueryHandler],
        [FindAllBookQuery, FindAllBookQueryHandler],
        [FindAllPaginatedBookQuery, FindAllPaginatedBookQueryHandler],
      ],
    });
  }
}
