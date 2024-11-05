import { format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const loggerConfig = {
  transports: [
    // 控制台日志
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.ms(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    // 信息日志文件
    new DailyRotateFile({
      filename: 'logs/info-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json()
      ),
      maxSize: '20m',
      maxFiles: '14d',
    }),
    // 错误日志文件
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: format.combine(
        format.timestamp(),
        format.json()
      ),
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
};