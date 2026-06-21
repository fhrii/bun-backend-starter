import { match } from 'oxide.ts';
import { QueryBus } from '@/lib/cqrs';
import { NotFoundException } from '@/lib/exceptions';
import { appFactory } from '@/lib/http';
import { inputValidator, useDependency } from '@/lib/http/middleware';
import { BookMapper } from '../../book.mapper';
import { FindBookQuery } from './find.query';
import { FindParamSchema } from './find.request.dto';

export const findBookHttpHandler = appFactory.createHandlers(
  inputValidator('param', FindParamSchema),
  useDependency('QueryBus', QueryBus),
  useDependency('BookMapper', BookMapper),
  async (c) => {
    const { id } = c.req.valid('param');
    const queryBus = c.get('QueryBus');
    const bookMapper = c.get('BookMapper');
    const result = await queryBus.execute(new FindBookQuery(id));

    return match(result, {
      Ok: (r) => {
        if (r.isNone()) {
          throw new NotFoundException('Book not found');
        }

        return c.json({ data: bookMapper.toResponse(r.unwrap()).unwrap() });
      },
      Err: (err) => {
        throw err;
      },
    });
  },
);
