import type { Context } from 'hono';
import { container, singleton } from 'tsyringe';
import { createEmitter, type EventHandler } from '@hono/event-emitter';
import { DomainEvent } from '@/lib/ddd/domain-event.base';
import { Logger } from '@/lib/logger';
import { RequestContext } from '../request-context';
import type { IEventHandler } from './interfaces/event-handler.interface';

export type EventClass = new (...args: any[]) => DomainEvent;
export type EventHandlerType<T extends DomainEvent> = new (
  ...args: any[]
) => IEventHandler<T>;

@singleton()
export class EventEmitter {
  private emitter = createEmitter();
  private readonly handlers = new Map<string, IEventHandler<any>[]>();
  private readonly logger: Logger;

  constructor() {
    this.logger = container.resolve(Logger);
  }

  register<T extends DomainEvent>(
    eventClass: EventClass,
    handlerClass: EventHandlerType<T>,
  ): void {
    const eventId = eventClass.name;
    const handler = container.resolve(handlerClass);
    const currentEventHandlers = this.handlers.get(eventId);

    if (currentEventHandlers) {
      this.handlers.set(eventId, [...currentEventHandlers, handler]);

      return;
    }

    this.handlers.set(eventId, [handler]);
  }

  createHandlers() {
    const handlers = [...this.handlers].map(([eventName, eventHandlers]) => {
      const newHandlers = eventHandlers.map((eventHandler) => {
        return async (_: Context, payload: DomainEvent) => {
          await eventHandler.execute(payload);
        };
      });

      return [eventName, newHandlers] as [string, EventHandler<any>[]];
    });

    handlers.forEach((handler) => {
      this.logger.debug(
        `[EventEmitter] Event ${handler[0]} was registered with ${handler[1].length} handlers`,
      );
    });

    const emitterHandlers = Object.fromEntries(handlers);

    this.emitter = createEmitter(emitterHandlers);
  }

  emit(event: DomainEvent) {
    const c = RequestContext.currentContext?.context.c;

    if (c) {
      this.emitter.emit(c, event.constructor.name, event);

      return;
    }

    this.logger.warn(
      '[EventEmitter] Event was not published since the event not triggered through http',
    );
  }

  async emitAsync(event: DomainEvent) {
    const c = RequestContext.currentContext?.context.c;

    if (c) {
      await this.emitter.emitAsync(c, event.constructor.name, event);

      return;
    }

    this.logger.warn(
      '[EventEmitter] Event was not published since the event not triggered through http',
    );
  }
}
