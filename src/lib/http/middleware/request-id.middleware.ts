import type { Context, MiddlewareHandler } from 'hono';
import { createId } from '@paralleldrive/cuid2';

export interface RequestIdOptions {
  limitLength?: number;
  headerName?: string;
  generator?: (c: Context) => string;
}

export const requestId = ({
  limitLength = 255,
  headerName = 'X-Request-Id',
  generator = () => createId(),
}: RequestIdOptions = {}): MiddlewareHandler => {
  return async function (c, next) {
    let reqId = headerName ? c.req.header(headerName) : undefined;

    if (!reqId || reqId.length > limitLength || /[^\w\-=]/.test(reqId)) {
      reqId = generator(c);
    }

    c.set('REQUEST_ID', reqId);

    if (headerName) {
      c.header(headerName, reqId);
    }

    await next();
  };
};
