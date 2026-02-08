import { ClientException } from './client.exception';

export class InvariantException extends ClientException {
  constructor(message: string) {
    super(message, 422);
  }
}
