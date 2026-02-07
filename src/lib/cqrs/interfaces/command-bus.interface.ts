import type { Command } from './command';
import type { ICommandHandler } from './command-handler.interface';

export type CommandHandlerType<
  T extends Command<TResult>,
  TResult = unknown,
> = new (...args: unknown[]) => ICommandHandler<T, TResult>;

type CommandClass<CommandBase extends Command = Command> = new (
  ...args: unknown[]
) => CommandBase;

export interface ICommandBus<CommandBase extends Command = Command> {
  execute: <TResult = void>(command: CommandBase) => Promise<TResult>;
  register: (
    commandClass: CommandClass<CommandBase>,
    handlerClass: CommandHandlerType<CommandBase>,
  ) => void;
}
