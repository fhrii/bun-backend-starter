import { z } from 'zod';

export const DeleteBookCommandParamSchema = z.object({
  id: z.string('id must be a string').min(1, 'id is required'),
});

export type DeleteBookCommandParamDto = z.infer<typeof DeleteBookCommandParamSchema>;
