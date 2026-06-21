import { Router } from '@/lib/http';
import { createBookHttpHandler } from './command/create-book/create-book.http-handler';
import { deleteBookHttpHandler } from './command/delete-book/delete-book.http-handler';
import { updateBookHttpHandler } from './command/update-book/update-book.http-handler';
import { findBookHttpHandler } from './query/find/find.http-handler';
import { findAllPaginatedBookHttpHandler } from './query/find-all-paginated/find-all-paginated.http-handler';

const v1BasePath = '/api/v1/books';

export const bookRouter = new Router('Book');

bookRouter.c.get(v1BasePath, ...findAllPaginatedBookHttpHandler);
bookRouter.c.post(v1BasePath, ...createBookHttpHandler);
bookRouter.c.get(`${v1BasePath}:id`, ...findBookHttpHandler);
bookRouter.c.put(`${v1BasePath}:id`, ...updateBookHttpHandler);
bookRouter.c.patch(`${v1BasePath}:id`, ...updateBookHttpHandler);
bookRouter.c.delete(`${v1BasePath}:id`, ...deleteBookHttpHandler);
