export class InvalidHandlerException extends Error {
  constructor(handlerName: string, type: 'command' | 'query') {
    super(`Invalid ${type} handler "${handlerName}".`);
  }
}
