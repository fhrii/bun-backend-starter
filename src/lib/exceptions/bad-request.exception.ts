import { ClientException } from './client.exception';

export class BadRequestException extends ClientException {
  constructor(message: string) {
    super(message, 400);
  }
}
