import { NODE_ENV } from '@/shared/config/env.provider';
import { LoggerService } from '@nestjs/common';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import winston from 'winston';

const isDev = NODE_ENV === 'development';

export const logger: LoggerService = WinstonModule.createLogger({
  level: isDev ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
  ),
  transports: [
    new winston.transports.Console({
      format: isDev
        ? winston.format.combine(
            winston.format.colorize(),
            nestWinstonModuleUtilities.format.nestLike('Shortener', {
              prettyPrint: true,
              colors: true,
            }),
          )
        : winston.format.json(),
    }),
  ],
});
