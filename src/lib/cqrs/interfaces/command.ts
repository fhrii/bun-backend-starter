// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export class Command<TResult = unknown> {
  readonly 'RESULT_COMMAND_SYMBOL': TResult;
}
