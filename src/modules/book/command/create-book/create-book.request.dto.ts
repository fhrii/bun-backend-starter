import { z } from 'zod';

export const CreateBookCommandSchema = z.object({
  title: z.string('title must be a string').min(1, 'title is required'),
  author: z.string('author must be a string').min(1, 'author is required'),
  publisher: z
    .string('publisher must be a string')
    .min(1, 'publisher is required'),
});

export type CreateBookCommandDto = z.infer<typeof CreateBookCommandSchema>;
