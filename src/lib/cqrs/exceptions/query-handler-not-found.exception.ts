export class QueryHandlerNotFoundException extends Error {
  constructor(queryName: string) {
    super(`No handler registered for query "${queryName}".`);
  }
}
