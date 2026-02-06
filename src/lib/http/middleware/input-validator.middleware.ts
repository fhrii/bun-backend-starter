import type { ValidationTargets } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { z } from 'zod';
import { zValidator as zv } from '@hono/zod-validator';

export const inputValidator = <
  T extends z.ZodType,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) => {
  return zv(target, schema, (result) => {
    if (!result.success) {
      throw new HTTPException(400, {
        message:
          result.error.issues[0]?.message ||
          'Unknown Error on validating input',
        cause: result.error,
      });
    }
  });
};
