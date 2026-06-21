import type { Option, Result } from 'oxide.ts';
import { Command } from '@/lib/cqrs';
import type { BookInvariantException } from '../../domain/book.error';
import type { Book } from '../../domain/entity/book.entity';
import type {
  UpdateBookCommandBodyDto,
  UpdateBookCommandParamDto,
} from './update-book.request.dto';

export class UpdateBookCommand extends Command<
  Result<Option<Book>, Error | BookInvariantException>
> {
  constructor(
    public readonly bookId: UpdateBookCommandParamDto['id'],
    public readonly payload: UpdateBookCommandBodyDto,
  ) {
    super();
  }
}
