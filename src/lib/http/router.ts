import { Hono } from 'hono';
import { container } from 'tsyringe';
import { Logger } from '../logger';
import type { AppEnvirontmentVariables } from './app.type';

export class Router {
  private readonly router = new Hono();
  private readonly logger = container.resolve(Logger);

  constructor(private readonly basePath: string) {}

  get c() {
    return this.router;
  }

  registerToApp(app: Hono<AppEnvirontmentVariables>) {
    app.route(this.basePath, this.router);
    this.logger.debug(`[Router] Registering routes -> ${this.basePath}`);
  }
}
