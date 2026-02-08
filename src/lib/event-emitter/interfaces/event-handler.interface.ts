import type { DomainEvent } from '@/lib/ddd/domain-event.base';

export interface IEventHandler<IEvent extends DomainEvent> {
  execute: (command: IEvent) => Promise<void> | void;
}
