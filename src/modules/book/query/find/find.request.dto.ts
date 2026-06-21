import { z } from 'zod';

export const FindParamSchema = z.object({ id: z.string() });
