import { ClientException } from './client.exception';

export class UnauthorizedException extends ClientException {
  constructor(message: string) {
    super(message, 401);
  }
}
