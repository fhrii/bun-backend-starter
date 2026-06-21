import type { Result } from 'oxide.ts';
import { Command } from '@/lib/cqrs';
import type { BookInvariantException } from '../../domain/book.error';
import type { Book } from '../../domain/entity/book.entity';
import type { CreateBookCommandDto } from './create-book.request.dto';

export class CreateBookCommand extends Command<
  Result<Book, BookInvariantException | Error>
> {
  constructor(public readonly payload: CreateBookCommandDto) {
    super();
  }
}
