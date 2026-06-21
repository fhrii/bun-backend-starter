import { match } from 'oxide.ts';
import { CommandBus } from '@/lib/cqrs';
import { appFactory } from '@/lib/http';
import { inputValidator, useDependency } from '@/lib/http/middleware';
import { BookMapper } from '../../book.mapper';
import { BookNotFoundException } from '../../domain/book.error';
import { UpdateBookCommand } from './update-book.command';
import {
  UpdateBookCommandBodySchema,
  UpdateBookCommandParamSchema,
} from './update-book.request.dto';

export const updateBookHttpHandler = appFactory.createHandlers(
  inputValidator('param', UpdateBookCommandParamSchema),
  inputValidator('json', UpdateBookCommandBodySchema),
  useDependency('CommandBus', CommandBus),
  useDependency('BookMapper', BookMapper),
  async (c) => {
    const { id } = c.req.valid('param');
    const payload = c.req.valid('json');
    const commandBus = c.get('CommandBus');
    const bookMapper = c.get('BookMapper');
    const result = await commandBus.execute(new UpdateBookCommand(id, payload));

    return match(result, {
      Ok: (r) => {
        if (r.isNone()) {
          throw new BookNotFoundException('Book not found');
        }

        return c.json(
          { data: bookMapper.toResponse(r.unwrap()).unwrap() },
          200,
        );
      },
      Err: (err) => {
        throw err;
      },
    });
  },
);
