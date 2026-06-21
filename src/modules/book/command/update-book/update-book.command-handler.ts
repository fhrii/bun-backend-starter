import { Err, None, Ok } from 'oxide.ts';
import { inject, injectable } from 'tsyringe';
import type { ICommandHandler } from '@/lib/cqrs';
import { BookMapper } from '../../book.mapper';
import { BOOK_REPOSITORY_TOKEN } from '../../book.token';
import type { BookRepository } from '../../repository/book.repository';
import type { UpdateBookCommand } from './update-book.command';

@injectable()
export class UpdateBookCommandHandler implements ICommandHandler<UpdateBookCommand> {
  constructor(
    @inject(BOOK_REPOSITORY_TOKEN)
    private readonly bookRepository: BookRepository,
    @inject(BookMapper) private readonly bookMapper: BookMapper,
  ) {}

  async execute(command: UpdateBookCommand) {
    const bookResult = await this.bookRepository.find(command.id);

    if (bookResult.isErr()) {
      return Err(bookResult.unwrapErr());
    }

    const bookOption = bookResult.unwrap();

    if (bookOption.isNone()) {
      return Ok(None);
    }

    const book = bookOption.unwrap();
    const props = book.getProps();
    const updatedBookResult = this.bookMapper.toDomain({
      ...props,
      ...command,
    });

    if (updatedBookResult.isErr()) {
      return Err(updatedBookResult.unwrapErr());
    }

    const updateResult = await this.bookRepository.update(
      updatedBookResult.unwrap(),
    );

    return updateResult;
  }
}
