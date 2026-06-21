import type { Option, Result } from 'oxide.ts';
import { Command } from '@/lib/cqrs';
import type { Book } from '../../domain/entity/book.entity';
import type { DeleteBookCommandParamDto } from './delete-book.request.dto';

export class DeleteBookCommand extends Command<Result<Option<Book>, Error>> {
  constructor(public readonly bookId: DeleteBookCommandParamDto['id']) {
    super();
  }
}
