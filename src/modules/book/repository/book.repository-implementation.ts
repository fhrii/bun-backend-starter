import { Err, None, Ok, type Option, Result, Some } from 'oxide.ts';
import { inject, injectable } from 'tsyringe';
import type { BookModel } from '@/lib/db';
import type { AggregateID } from '@/lib/ddd';
import {
  Paginated,
  type PaginatedQueryParam,
  type QueryParam,
} from '@/lib/ddd/repository.port';
import { BookMapper } from '../book.mapper';
import { BOOK_REPOSITORY_TOKEN } from '../book.token';
import type { BookInvariantException } from '../domain/book.error';
import { Book } from '../domain/entity/book.entity';
import type { BookRepository } from './book.repository';

@injectable({ token: BOOK_REPOSITORY_TOKEN })
export class BookRepositoryImplementation implements BookRepository {
  private bookDatabase: BookModel[] = [];

  constructor(@inject(BookMapper) private readonly bookMapper: BookMapper) {}

  async insert(entity: Book): Promise<Result<Book, Error>> {
    try {
      const bookModelResult = this.bookMapper.toPersistence(entity);
      const bookModel = bookModelResult.unwrap();

      this.bookDatabase.push(bookModel);

      return await Promise.resolve(Ok(entity));
    } catch (error) {
      if (error instanceof Error) {
        return Err(error);
      }

      return Err(new Error(`Unknown Error: ${error}`));
    }
  }

  async update(entity: Book): Promise<Result<Option<Book>, Error>> {
    try {
      const bookModelResult = this.bookMapper.toPersistence(entity);
      const bookModel = bookModelResult.unwrap();
      const findBookIndex = this.bookDatabase.findIndex(
        (book) => book.id === entity.id,
      );

      if (findBookIndex === -1) {
        return await Promise.resolve(Ok(None));
      }

      this.bookDatabase[findBookIndex] = bookModel;

      return await Promise.resolve(Ok(Some(entity)));
    } catch (error) {
      if (error instanceof Error) {
        return Err(error);
      }

      return Err(new Error(`Unknown Error: ${error}`));
    }
  }

  async delete(entity: Book): Promise<Result<Option<Book>, Error>> {
    try {
      const bookModelResult = this.bookMapper.toPersistence(entity);
      const bookModel = bookModelResult.unwrap();
      const findBookIndex = this.bookDatabase.findIndex(
        (book) => book.id === entity.id,
      );

      if (findBookIndex === -1) {
        return await Promise.resolve(Ok(None));
      }

      this.bookDatabase = this.bookDatabase.filter(
        (book) => book.id !== bookModel.id,
      );

      return await Promise.resolve(Ok(Some(entity)));
    } catch (error) {
      if (error instanceof Error) {
        return Err(error);
      }

      return Err(new Error(`Unknown Error: ${error}`));
    }
  }

  async find(
    id: AggregateID,
  ): Promise<Result<Option<Book>, BookInvariantException | Error>> {
    try {
      const findBookModel = this.bookDatabase.find((b) => b.id === id);

      if (!findBookModel) {
        return await Promise.resolve(Ok(None));
      }

      const bookResult = this.bookMapper.toDomain(findBookModel);
      const book = bookResult.unwrap();

      return await Promise.resolve(Ok(Some(book)));
    } catch (error) {
      if (error instanceof Error) {
        return Err(error);
      }

      return Err(new Error(`Unknown Error: ${error}`));
    }
  }

  async findAll(
    query: QueryParam<Book>,
  ): Promise<Result<Book[], BookInvariantException | Error>> {
    try {
      const { search } = query;
      const bookResults =
        Object.keys(search).length > 0
          ? this.bookDatabase
              .filter((b) => {
                const validation = [];

                if (search.title) {
                  validation.push(search.title === b.title);
                }

                if (search.author) {
                  validation.push(search.author === b.author);
                }

                if (search.publisher) {
                  validation.push(search.publisher === b.publisher);
                }

                return validation.every(Boolean);
              })
              .map(this.bookMapper.toDomain.bind(this.bookMapper))
          : this.bookDatabase.map(
              this.bookMapper.toDomain.bind(this.bookMapper),
            );
      const books = Result.all(...bookResults).unwrap();

      return await Promise.resolve(Ok(books));
    } catch (error) {
      if (error instanceof Error) {
        return Err(error);
      }

      return Err(new Error(`Unknown Error: ${error}`));
    }
  }

  async findAllPaginated(
    query: PaginatedQueryParam<Book>,
  ): Promise<Result<Paginated<Book>, BookInvariantException | Error>> {
    try {
      const { search, limit, page, orderBy } = query;
      const offset = (page - 1) * limit;

      const filteredBooks =
        Object.keys(search).length > 0
          ? this.bookDatabase.filter((b) => {
              const validation = [];

              if (search.title) {
                validation.push(search.title === b.title);
              }

              if (search.author) {
                validation.push(search.author === b.author);
              }

              if (search.publisher) {
                validation.push(search.publisher === b.publisher);
              }

              return validation.every(Boolean);
            })
          : [...this.bookDatabase];

      if (orderBy.length > 0) {
        filteredBooks.sort((a, b) => {
          for (const { field, param } of orderBy) {
            const valA = a[field as keyof typeof a];
            const valB = b[field as keyof typeof b];

            if (valA < valB) {
              return param === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
              return param === 'asc' ? 1 : -1;
            }
          }

          return 0;
        });
      }

      const bookResults = filteredBooks.map(
        this.bookMapper.toDomain.bind(this.bookMapper),
      );
      const pagedBookResults = bookResults.slice(offset, offset + limit);
      const books = Result.all(...pagedBookResults).unwrap();

      return await Promise.resolve(
        Ok(
          new Paginated(
            pagedBookResults.length,
            limit,
            page,
            bookResults.length,
            books,
          ),
        ),
      );
    } catch (error) {
      if (error instanceof Error) {
        return Err(error);
      }

      return Err(new Error(`Unknown Error: ${error}`));
    }
  }
}
