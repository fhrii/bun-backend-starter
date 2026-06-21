import { z } from 'zod';

export const UpdateBookCommandParamSchema = z.object({
  id: z.string('id must be a string').min(1, 'id is required'),
});

export const UpdateBookCommandBodySchema = z.object({
  title: z.string('title must be a string').min(1, 'title is required').optional(),
  author: z.string('author must be a string').min(1, 'author is required').optional(),
  publisher: z.string('publisher must be a string').min(1, 'publisher is required').optional(),
});

export type UpdateBookCommandParamDto = z.infer<typeof UpdateBookCommandParamSchema>;
export type UpdateBookCommandBodyDto = z.infer<typeof UpdateBookCommandBodySchema>;
