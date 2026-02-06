import { cors } from 'hono/cors';
import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { container } from 'tsyringe';
import { Config } from '@/lib/config';
import { Logger } from '@/lib/logger';
import type { AppEnvirontmentVariables } from './app.type';

export const appFactory = createFactory<AppEnvirontmentVariables>({
  initApp: (app) => {
    const config = container.resolve(Config);
    const logger = container.resolve(Logger);

    app.use(cors({ origin: '*' }));

    app.onError(async (error, c) => {
      const buildResponse = (message: string, status: ContentfulStatusCode) => {
        return c.json(
          {
            message,
            stack:
              config.getConfig('NODE_ENV') === 'development'
                ? error.stack
                : undefined,
          },
          status,
        );
      };

      if (error instanceof HTTPException) {
        const errorMessage =
          error.message || (await error.getResponse().text());

        return buildResponse(errorMessage, error.status);
      }

      logger.error(error);

      return buildResponse(
        'Internal Server Error',
        500 as ContentfulStatusCode,
      );
    });
  },
});
