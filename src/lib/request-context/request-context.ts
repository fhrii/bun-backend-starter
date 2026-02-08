import { AsyncLocalStorage } from 'node:async_hooks';
import type { Context } from 'hono';
import type { AppEnvirontmentVariables } from '../http';

export interface RequestContextValues {
  c: Context<AppEnvirontmentVariables>;
  REQUEST_ID: string;
}

export class RequestContext<
  TContext extends RequestContextValues = RequestContextValues,
> {
  static cls = new AsyncLocalStorage<RequestContext>();

  static get currentContext() {
    return this.cls.getStore();
  }

  constructor(public readonly context: TContext) {}
}
