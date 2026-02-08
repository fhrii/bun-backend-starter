import { Hono } from 'hono';
import type { AppEnvirontmentVariables } from './app.type';

export class Router {
  private readonly _router = new Hono();

  constructor(private readonly basePath: string) {}

  get c() {
    return this._router;
  }

  registerToApp(app: Hono<AppEnvirontmentVariables>) {
    app.route(this.basePath, this._router);
  }
}
