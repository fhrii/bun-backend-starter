import { match } from 'oxide.ts';
import { QueryBus } from '@/lib/cqrs';
import { appFactory } from '@/lib/http';
import { inputValidator, useDependency } from '@/lib/http/middleware';
import { BookMapper } from '../../book.mapper';
import { FindAllPaginatedBookQuery } from './find-all-paginated.query';
import { FindAllBooksPaginatedQuerySchema } from './find-all-paginated.request.dto';

export const findAllPaginatedBookHttpHandler = appFactory.createHandlers(
  inputValidator('query', FindAllBooksPaginatedQuerySchema),
  useDependency('QueryBus', QueryBus),
  useDependency('BookMapper', BookMapper),
  async (c) => {
    const { page, limit, orderBy, ...search } = c.req.valid('query');
    const queryBus = c.get('QueryBus');
    const bookMapper = c.get('BookMapper');
    const result = await queryBus.execute(
      new FindAllPaginatedBookQuery({ page, limit, orderBy, search }),
    );

    return match(result, {
      Ok: (r) => c.json(bookMapper.toPaginatedResponse(r).unwrap()),
      Err: (err) => {
        throw err;
      },
    });
  },
);
