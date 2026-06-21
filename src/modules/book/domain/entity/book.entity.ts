import { Result } from 'oxide.ts';
import { z } from 'zod';
import { createId } from '@paralleldrive/cuid2';
import { AggregateRoot, type CreateEntityProps } from '@/lib/ddd';
import { BookInvariantException } from '../book.error';
import type { BookProps } from '../book.type';

export const BookSchema = z.object({
  title: z
    .string('title must be a string')
    .nonempty('title is required')
    .nonoptional('title is required'),
  author: z
    .string('author must be a string')
    .nonempty('author is required')
    .nonoptional('author is required'),
  publisher: z
    .string('publisher must be a string')
    .nonempty('publisher is required')
    .nonoptional('publisher is required'),
});

export class Book extends AggregateRoot<BookProps> {
  constructor(props: CreateEntityProps<BookProps>) {
    super(props, BookSchema, BookInvariantException);
  }

  static Create(props: BookProps): Result<Book, BookInvariantException> {
    const id = createId();

    return Result.safe(() => new Book({ id, props })) as Result<
      Book,
      BookInvariantException
    >;
  }
}
