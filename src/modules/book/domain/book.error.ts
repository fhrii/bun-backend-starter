import { InvariantException, NotFoundException } from '@/lib/exceptions';

export class BookInvariantException extends InvariantException {
  constructor(message: string) {
    super(message);

    this.name = 'BookInvariantException';
  }
}

export class BookNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);

    this.name = 'BookNotFoundException';
  }
}
