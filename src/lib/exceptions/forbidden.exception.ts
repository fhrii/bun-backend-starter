import { ClientException } from './client.exception';

export class ForbiddenException extends ClientException {
  constructor(message: string) {
    super(message, 403);
  }
}
