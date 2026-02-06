import { type Logger as PinoLogger, pino } from 'pino';
import { inject, injectable } from 'tsyringe';
import { Config } from '@/lib/config';

type LogObj = Record<string, unknown>;

@injectable()
export class Logger {
  private readonly logger: PinoLogger;

  constructor(@inject(Config) private config: Config) {
    const isDevelopment = this.config.getConfig('NODE_ENV') === 'development';

    this.logger = pino({
      level: isDevelopment ? 'debug' : 'info',
      transport: isDevelopment
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
            },
          }
        : undefined,
    });
  }

  info(msg: string, obj?: LogObj): void;
  info(obj: LogObj, msg?: string): void;
  info(a: string | LogObj, b?: LogObj | string): void {
    if (typeof a === 'string') {
      this.logger.info(b ?? {}, a);
    } else {
      this.logger.info(a, typeof b === 'string' ? b : undefined);
    }
  }

  warn(msg: string, obj?: LogObj): void;
  warn(obj: LogObj, msg?: string): void;
  warn(a: string | LogObj, b?: LogObj | string): void {
    if (typeof a === 'string') {
      this.logger.warn(b ?? {}, a);
    } else {
      this.logger.warn(a, typeof b === 'string' ? b : undefined);
    }
  }

  debug(msg: string, obj?: LogObj): void;
  debug(obj: LogObj, msg?: string): void;
  debug(a: string | LogObj, b?: LogObj | string): void {
    if (typeof a === 'string') {
      this.logger.debug(b ?? {}, a);
    } else {
      this.logger.debug(a, typeof b === 'string' ? b : undefined);
    }
  }

  error(msg: string, obj?: LogObj): void;
  error(obj: LogObj | Error, msg?: string): void;
  error(a: string | Error | LogObj, b?: string | LogObj): void {
    if (a instanceof Error) {
      this.logger.error(a, typeof b === 'string' ? b : undefined);

      return;
    }
    if (typeof a === 'string') {
      this.logger.error(b ?? {}, a);
    } else {
      this.logger.error(a, typeof b === 'string' ? b : undefined);
    }
  }

  get raw(): PinoLogger {
    return this.logger;
  }
}
