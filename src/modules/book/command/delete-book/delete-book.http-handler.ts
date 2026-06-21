import { match } from 'oxide.ts';
import { CommandBus } from '@/lib/cqrs';
import { appFactory } from '@/lib/http';
import { inputValidator, useDependency } from '@/lib/http/middleware';
import { BookMapper } from '../../book.mapper';
import { BookNotFoundException } from '../../domain/book.error';
import { DeleteBookCommand } from './delete-book.command';
import { DeleteBookCommandParamSchema } from './delete-book.request.dto';

export const deleteBookHttpHandler = appFactory.createHandlers(
  inputValidator('param', DeleteBookCommandParamSchema),
  useDependency('CommandBus', CommandBus),
  useDependency('BookMapper', BookMapper),
  async (c) => {
    const { id } = c.req.valid('param');
    const commandBus = c.get('CommandBus');
    const result = await commandBus.execute(new DeleteBookCommand(id));

    return match(result, {
      Ok: (r) => {
        if (r.isNone()) {
          throw new BookNotFoundException('Book not found');
        }

        return c.json({ message: 'Book deleted successfully' }, 200);
      },
      Err: (err) => {
        throw err;
      },
    });
  },
);
