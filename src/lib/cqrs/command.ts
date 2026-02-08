import { createId } from '@paralleldrive/cuid2';
import { RequestContext } from '../request-context';

export interface CommandMetaData {
  corellationId: string;
  causationId?: string;
  causationType?: string;
  aggregateId?: string;
  aggregateType?: string;
  timestamp: number;
}

export type CommandProps<T> = Omit<T, 'id' | 'metadata'> &
  Partial<Omit<Command, 'RESULT_COMMAND_SYMBOL'>>;

export class Command<TResult = unknown> {
  public readonly id: string;
  public readonly metadata: CommandMetaData;
  public readonly 'RESULT_COMMAND_SYMBOL': TResult;

  constructor(command?: CommandProps<unknown>) {
    this.id = createId();
    this.metadata = {
      corellationId:
        command?.metadata?.corellationId ||
        RequestContext.currentContext?.context.REQUEST_ID ||
        `Failed to get ID (MessageId: ${createId()})`,
      causationId: command?.metadata?.causationId,
      causationType: command?.metadata?.causationType,
      aggregateId: command?.metadata?.aggregateId,
      aggregateType: command?.metadata?.aggregateType,
      timestamp: Date.now(),
    };
  }
}
