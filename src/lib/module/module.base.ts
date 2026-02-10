import type { Hono } from 'hono';
import { container } from 'tsyringe';
import {
  type Command,
  CommandBus,
  type CommandClass,
  type CommandHandlerType,
  type Query,
  QueryBus,
  type QueryClass,
  type QueryHandlerType,
} from '../cqrs';
import type { DomainEvent } from '../ddd';
import {
  type EventClass,
  EventEmitter,
  type EventHandlerType,
} from '../event-emitter';
import type { AppEnvirontmentVariables, Router } from '../http';

type CommandWithHandler<T extends Command> = [
  CommandClass,
  CommandHandlerType<T>,
];
type QueryWithHandler<T extends Query> = [QueryClass, QueryHandlerType<T>];
type EventWithHandler<T extends DomainEvent> = [
  EventClass,
  EventHandlerType<T>,
];

interface ModuleProps {
  router?: Router;
  commands?: CommandWithHandler<any>[];
  queries?: QueryWithHandler<any>[];
  events?: EventWithHandler<any>[];
}

export class Module {
  private readonly router: Router | undefined;
  private readonly commandBus = container.resolve(CommandBus);
  private readonly queryBus = container.resolve(QueryBus);
  private readonly eventEmitter = container.resolve(EventEmitter);

  constructor({ router, commands, queries, events }: ModuleProps) {
    this.router = router;

    commands?.forEach(([command, commandHandler]) => {
      this.commandBus.register(command, commandHandler);
    });
    queries?.forEach(([query, queryHandler]) => {
      this.queryBus.register(query, queryHandler);
    });
    events?.forEach(([event, eventHandler]) => {
      this.eventEmitter.register(event, eventHandler);
    });
  }

  registerRoute(app: Hono<AppEnvirontmentVariables>) {
    if (this.router) {
      this.router.registerToApp(app);
    }
  }
}
