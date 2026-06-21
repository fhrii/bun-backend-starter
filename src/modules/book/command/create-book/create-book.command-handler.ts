import { Err } from 'oxide.ts';
import { inject, injectable } from 'tsyringe';
import type { ICommandHandler } from '@/lib/cqrs';
import { BOOK_REPOSITORY_TOKEN } from '../../book.token';
import { Book } from '../../domain/entity/book.entity';
import type { BookRepository } from '../../repository/book.repository';
import type { CreateBookCommand } from './create-book.command';

@injectable()
export class CreateBookCommandHandler implements ICommandHandler<CreateBookCommand> {
  constructor(
    @inject(BOOK_REPOSITORY_TOKEN)
    private readonly bookRepository: BookRepository,
  ) {}

  async execute(command: CreateBookCommand) {
    const bookResult = Book.Create(command.payload);

    if (bookResult.isErr()) {
      return Err(bookResult.unwrapErr());
    }

    const book = bookResult.unwrap();
    const insertResult = await this.bookRepository.insert(book);

    return insertResult;
  }
}
