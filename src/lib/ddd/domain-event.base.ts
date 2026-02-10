import { createId } from '@paralleldrive/cuid2';
import { RequestContext } from '../request-context';

export interface DomainEventMetaData {
  corellationId: string;
  causationId?: string;
  causationType?: string;
  aggregateId?: string;
  aggregateType?: string;
  timestamp: number;
}

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> &
  Partial<Omit<DomainEvent, 'RESULT_COMMAND_SYMBOL'>>;

export class DomainEvent {
  public readonly id: string;
  public readonly metadata: DomainEventMetaData;

  constructor(event?: DomainEventProps<any>) {
    this.id = createId();
    this.metadata = {
      corellationId:
        event?.metadata?.corellationId ||
        RequestContext.currentContext?.context.REQUEST_ID ||
        `Failed to get ID (MessageId: ${createId()})`,
      causationId: event?.metadata?.causationId,
      causationType: event?.metadata?.causationType,
      aggregateId: event?.metadata?.aggregateId,
      aggregateType: event?.metadata?.aggregateType,
      timestamp: Date.now(),
    };
  }
}
