import { container, singleton } from 'tsyringe';
import { Logger } from '@/lib/logger';
import type { Command } from './command';
import { CommandHandlerNotFoundException } from './exceptions/command-handler-not-found.exception';
import type {
  CommandHandlerType,
  ICommandBus,
  ICommandHandler,
} from './interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandClass = new (...args: any[]) => Command;

@singleton()
export class CommandBus implements ICommandBus {
  private readonly handlers = new Map<
    string,
    ICommandHandler<Command, unknown>
  >();
  private readonly logger: Logger;

  constructor() {
    this.logger = container.resolve(Logger);
  }

  async execute<TResult = void>(command: Command): Promise<TResult> {
    const commandId = this.getCommandId(command);
    const handler = this.handlers.get(commandId);

    if (!handler) {
      const commandName = this.getCommandName(command);

      throw new CommandHandlerNotFoundException(commandName);
    }

    this.logger.debug(`Executing command: ${commandId}`);

    return handler.execute(command) as Promise<TResult>;
  }

  register(
    commandClass: CommandClass,
    handlerClass: CommandHandlerType<Command>,
  ): void {
    const commandId = commandClass.name;

    if (this.handlers.has(commandId)) {
      this.logger.warn(
        `Command handler for "${commandId}" is already registered. Overriding.`,
      );
    }

    const handlerInstance = container.resolve(handlerClass);

    this.handlers.set(commandId, handlerInstance);

    this.logger.debug(
      `Registered command handler: ${handlerClass.name} for ${commandId}`,
    );
  }

  private getCommandId(command: Command): string {
    const prototype = Object.getPrototypeOf(command) as {
      constructor: { name: string };
    };

    return prototype.constructor.name;
  }

  private getCommandName(command: Command): string {
    return this.getCommandId(command);
  }
}
