import type { Command } from './command';

export interface ICommandHandler<
  TCommand extends Command<TResult>,
  TResult = TCommand['RESULT_COMMAND_SYMBOL'],
> {
  execute: (command: TCommand) => Promise<TResult>;
}
