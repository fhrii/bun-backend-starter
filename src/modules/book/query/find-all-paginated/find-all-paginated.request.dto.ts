import { z } from 'zod';

export const FindAllBooksPaginatedQuerySchema = z.object({
  title: z.string('title must be a string').optional(),
  author: z.string('author must be a string').optional(),
  publisher: z.string('publsiher must be a string').optional(),
  page: z.coerce
    .number('page must be a number')
    .int('page must be an integer')
    .min(1, 'page must be greater than or equal to 1')
    .max(1000, 'page must be less than 1000')
    .default(1),
  limit: z.coerce
    .number('limit must be a number')
    .int('limit must be an integer')
    .min(1, 'limit must be greater than or equal to 1')
    .max(1000, 'limit must be less than 1000')
    .default(10),
  orderBy: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) {
        return [];
      }

      return Array.isArray(val) ? val : [val];
    })
    .pipe(
      z.array(
        z
          .string()
          .regex(
            /^(title|author|publisher):(asc|desc)$/,
            'Invalid orderBy format, example: title:asc',
          )
          .transform((val) => {
            const [field, param] = val.split(':');

            return {
              field: field as 'title' | 'author' | 'publisher',
              param: param as 'asc' | 'desc',
            };
          }),
      ),
    )
    .default([]),
});
