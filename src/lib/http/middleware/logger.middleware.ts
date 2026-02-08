import { container } from 'tsyringe';
import { Config } from '@/lib/config';
import { Logger } from '@/lib/logger';
import { appFactory } from '../app-factory';

export const loggerMiddleware = appFactory.createMiddleware(async (c, next) => {
  const config = container.resolve(Config);
  const isDevelopment = config.getConfig('NODE_ENV') === 'development';

  if (!isDevelopment) {
    await next();

    return;
  }

  const logger = container.resolve(Logger);
  const start = Date.now();

  await next();

  const duration = Date.now() - start;
  const logData = {
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    duration: `${duration}ms`,
    ip: c.req.header('x-forwarded-for') || c.req.raw.headers.get('host'),
    requestId: c.get('REQUEST_ID'),
    userAgent: c.req.header('user-agent'),
    query: c.req.query(),
  };

  logger.info(logData, `[${c.req.method}] ${c.req.path} -> ${c.res.status}`);
});
