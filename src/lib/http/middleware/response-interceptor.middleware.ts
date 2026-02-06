import { appFactory } from '../app-factory';

export const responseInterceptorMiddleware = appFactory.createMiddleware(
  async (c, next) => {
    await next();

    if (c.res.headers.get('Content-Type')?.includes('application/json')) {
      const originalResHeaders = c.res.headers;
      const responseBody = await c.res.json();
      let responseData: Record<string, unknown> = {
        status: c.res.status,
        data: responseBody,
      };

      if (typeof responseBody === 'object' && !Array.isArray(responseBody)) {
        responseData = { status: c.res.status, ...responseBody };
      }

      c.res = new Response(JSON.stringify(responseData), {
        status: c.res.status,
        statusText: c.res.statusText,
        headers: originalResHeaders,
      });
    }
  },
);
