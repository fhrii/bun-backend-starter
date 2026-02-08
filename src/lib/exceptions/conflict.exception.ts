import { ClientException } from './client.exception';

export class ConflictException extends ClientException {
  constructor(message: string) {
    super(message, 409);
  }
}
