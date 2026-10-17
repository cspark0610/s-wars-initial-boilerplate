import { ConsoleLogger, Injectable } from '@nestjs/common';
import { LoggerService } from '@src/domain/ports/logger.service';

@Injectable()
export class ConsoleLoggerAdapter extends ConsoleLogger implements LoggerService {
  info(message: string, context?: Record<string, unknown>): void {
    this.log(message, context ? JSON.stringify(context) : undefined);
  }
}
