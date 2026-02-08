import { ClientException } from './client.exception';

export class NotFoundException extends ClientException {
  constructor(message: string) {
    super(message, 404);
  }
}
