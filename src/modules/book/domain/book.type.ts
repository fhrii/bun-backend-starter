import type { z } from 'zod';
import type { BookSchema } from './entity/book.entity';

export type BookProps = z.infer<typeof BookSchema>;
