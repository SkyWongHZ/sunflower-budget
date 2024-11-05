import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './logger.config';
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot(loggerConfig),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}