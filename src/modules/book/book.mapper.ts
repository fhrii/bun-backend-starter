import { Ok, Result } from 'oxide.ts';
import { injectable } from 'tsyringe';
import type { BookModel } from '@/lib/db';
import type { Mapper, PaginatedResponse } from '@/lib/ddd';
import type { Paginated } from '@/lib/ddd/repository.port';
import type { BookInvariantException } from './domain/book.error';
import { Book } from './domain/entity/book.entity';
import { type BookResponse, BookResponseSchema } from './dto/book.response.dto';

@injectable()
export class BookMapper implements Mapper<Book, BookModel, BookResponse> {
  toPersistence(entity: Book): Result<BookModel, never> {
    const props = entity.getProps();

    return Ok({
      id: props.id,
      title: props.title,
      author: props.author,
      publisher: props.publisher,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  toDomain(record: Record<string, any>): Result<Book, BookInvariantException> {
    return Result.safe(() => {
      return new Book({
        id: record.id,
        props: {
          title: record.title,
          author: record.author,
          publisher: record.publisher,
        },
        createdAt:
          record.createdAt &&
          (typeof record.createdAt === 'string' ||
            typeof record.createdAt === 'number' ||
            record.createdAt instanceof Date)
            ? new Date(record.createdAt)
            : record.createdAt,
        updatedAt:
          record.updatedAt &&
          (typeof record.updatedAt === 'string' ||
            typeof record.updatedAt === 'number' ||
            record.updatedAt instanceof Date)
            ? new Date(record.updatedAt)
            : record.updatedAt,
      });
    }) as Result<Book, BookInvariantException>;
  }

  toResponse(entity: Book): Result<BookResponse, never> {
    const props = entity.getProps();
    const bookResponse = BookResponseSchema.parse(props);

    return Ok(bookResponse);
  }

  toPaginatedResponse(
    paginated: Paginated<Book>,
  ): Result<PaginatedResponse<BookResponse>, never> {
    const data = Result.all(
      ...paginated.data.map(this.toResponse.bind(this)),
    ).unwrap();

    return Ok({
      data,
      metadata: {
        limit: paginated.limit,
        page: paginated.page,
        total: paginated.total,
        totalPages: paginated.totalPages,
      },
    });
  }
}
