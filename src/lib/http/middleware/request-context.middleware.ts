import { RequestContext } from '@/lib/request-context';
import { appFactory } from '../app-factory';

export const requestContextMiddleware = appFactory.createMiddleware(
  async (c, next) => {
    await RequestContext.cls.run(
      new RequestContext({ c, REQUEST_ID: c.get('REQUEST_ID') }),
      async () => {
        await next();
      },
    );
  },
);
