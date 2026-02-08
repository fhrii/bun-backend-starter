import { container, singleton } from 'tsyringe';
import { Logger } from '@/lib/logger';
import { QueryHandlerNotFoundException } from './exceptions/query-handler-not-found.exception';
import type { IQueryBus, IQueryHandler, QueryHandlerType } from './interfaces';
import type { Query } from './query';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryClass = new (...args: any[]) => Query;

@singleton()
export class QueryBus implements IQueryBus {
  private readonly handlers = new Map<string, IQueryHandler<Query>>();
  private readonly logger: Logger;

  constructor() {
    this.logger = container.resolve(Logger);
  }

  async execute<TResult = unknown>(query: Query): Promise<TResult> {
    const queryId = this.getQueryId(query);
    const handler = this.handlers.get(queryId);

    if (!handler) {
      const queryName = this.getQueryName(query);

      throw new QueryHandlerNotFoundException(queryName);
    }

    this.logger.debug(`[QueryBus] Executing query: ${queryId}`);

    return handler.execute(query) as Promise<TResult>;
  }

  register(
    queryClass: QueryClass,
    handlerClass: QueryHandlerType<Query>,
  ): void {
    const queryId = queryClass.name;

    if (this.handlers.has(queryId)) {
      this.logger.warn(
        `[QueryBus] Query handler for "${queryId}" is already registered. Overriding.`,
      );
    }

    const handlerInstance =
      container.resolve<IQueryHandler<Query>>(handlerClass);

    this.handlers.set(queryId, handlerInstance);

    this.logger.debug(
      `[QueryBus] Registered query handler: ${handlerClass.name} for ${queryId}`,
    );
  }

  private getQueryId(query: Query): string {
    const prototype = Object.getPrototypeOf(query) as {
      constructor: { name: string };
    };

    return prototype.constructor.name;
  }

  private getQueryName(query: Query): string {
    return this.getQueryId(query);
  }
}
