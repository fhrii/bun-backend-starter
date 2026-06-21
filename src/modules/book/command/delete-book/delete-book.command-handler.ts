import { Err, None, Ok } from 'oxide.ts';
import { inject, injectable } from 'tsyringe';
import type { ICommandHandler } from '@/lib/cqrs';
import { BOOK_REPOSITORY_TOKEN } from '../../book.token';
import type { BookRepository } from '../../repository/book.repository';
import type { DeleteBookCommand } from './delete-book.command';

@injectable()
export class DeleteBookCommandHandler implements ICommandHandler<DeleteBookCommand> {
  constructor(
    @inject(BOOK_REPOSITORY_TOKEN)
    private readonly bookRepository: BookRepository,
  ) {}

  async execute(command: DeleteBookCommand) {
    const bookResult = await this.bookRepository.find(command.bookId);

    if (bookResult.isErr()) {
      return Err(bookResult.unwrapErr());
    }

    const bookOption = bookResult.unwrap();

    if (bookOption.isNone()) {
      return Ok(None);
    }

    const deleteResult = await this.bookRepository.delete(bookOption.unwrap());

    return deleteResult;
  }
}
