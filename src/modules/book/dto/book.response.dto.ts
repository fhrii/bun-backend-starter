import { z } from 'zod';

export const BookResponseSchema = z.object({
  id: z
    .string('id must be a string')
    .nonempty('id is required')
    .nonoptional('id is required'),
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
  createdAt: z
    .date('createdAt must be a string')
    .nonoptional('createdAt is required'),
  updatedAt: z
    .date('updatedAt must be a string')
    .nonoptional('updatedAt is required'),
});

export type BookResponse = z.infer<typeof BookResponseSchema>;
