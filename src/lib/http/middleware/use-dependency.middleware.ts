import type { MiddlewareHandler } from 'hono';
import { container, type InjectionToken } from 'tsyringe';

export const useDependency = <ContextKey extends string, T>(
  contextKey: ContextKey,
  dependency: InjectionToken<T>,
): MiddlewareHandler<{
  Variables: { [key in ContextKey]: T };
}> => {
  return async (c, next) => {
    c.set(contextKey, container.resolve(dependency));

    await next();
  };
};
