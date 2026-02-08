import { container } from 'tsyringe';
import { EventEmitter } from '../event-emitter';
import { Logger } from '../logger';
import type { DomainEvent } from './domain-event.base';
import { Entity } from './entity.base';

export abstract class AggregateRoot<EntityProps> extends Entity<EntityProps> {
  private events: DomainEvent[] = [];
  private readonly logger = container.resolve(Logger);
  private readonly eventEmitter = container.resolve(EventEmitter);

  addEvent(event: DomainEvent) {
    this.events.push(event);
  }

  clearEvents() {
    this.events.length = 0;
  }

  async publishEvents() {
    await Promise.all(
      this.events.map((event) => {
        this.logger.debug(
          {
            id: event.id,
            metadata: event.metadata,
          },
          `[EventEmitter] Event ${event.constructor.name} published for aggregate ${this.constructor.name} (${this.id})`,
        );

        return this.eventEmitter.emitAsync(event);
      }),
    );
    this.clearEvents();
  }
}
