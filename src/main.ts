import 'reflect-metadata';
import { container } from 'tsyringe';
import { Config } from '@/lib/config';
import { EventEmitter } from '@/lib/event-emitter';
import { appFactory } from '@/lib/http';
import {
  loggerMiddleware,
  requestContextMiddleware,
  requestId,
  responseInterceptorMiddleware,
} from '@/lib/http/middleware';
import { Logger } from '@/lib/logger';

const app = appFactory.createApp();
const now = Date.now();
const config = container.resolve(Config);
const logger = container.resolve(Logger);
const eventEmitter = container.resolve(EventEmitter);

app.use('*', requestId());
app.use('*', requestContextMiddleware);
app.use('*', loggerMiddleware);
app.use('*', responseInterceptorMiddleware);

app.get('/', (c) => {
  return c.json({
    name: 'TOS Servant',
    uptime: `${Math.floor((Date.now() - now) / 1000).toString()} seconds`,
  });
});

app.get('/flogs', (c) => {
  return c.json({
    name: 'TOS Servant',
    uptime: `${Math.floor((Date.now() - now) / 1000).toString()} seconds`,
  });
});

eventEmitter.createHandlers();

Bun.serve({ port: config.getConfig('PORT'), fetch: app.fetch });

logger.info(`🚀 Server started on port ${config.getConfig('PORT')}`);
