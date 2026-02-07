export class CommandHandlerNotFoundException extends Error {
  constructor(commandName: string) {
    super(`No handler registered for command "${commandName}".`);
  }
}
