import { ClientException } from './client.exception';

export class DomainErrorException extends ClientException {
  constructor(message: string) {
    super(message, 500);
  }
}
