import { match } from 'oxide.ts';
import { CommandBus } from '@/lib/cqrs';
import { appFactory } from '@/lib/http';
import { inputValidator, useDependency } from '@/lib/http/middleware';
import { BookMapper } from '../../book.mapper';
import { CreateBookCommand } from './create-book.command';
import { CreateBookCommandSchema } from './create-book.request.dto';

export const createBookHttpHandler = appFactory.createHandlers(
  inputValidator('json', CreateBookCommandSchema),
  useDependency('CommandBus', CommandBus),
  useDependency('BookMapper', BookMapper),
  async (c) => {
    const payload = c.req.valid('json');
    const commandBus = c.get('CommandBus');
    const bookMapper = c.get('BookMapper');
    const result = await commandBus.execute(new CreateBookCommand(payload));

    return match(result, {
      Ok: (r) => c.json({ data: bookMapper.toResponse(r).unwrap() }, 201),
      Err: (err) => {
        throw err;
      },
    });
  },
);
