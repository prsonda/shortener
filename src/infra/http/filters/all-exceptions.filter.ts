import { ErrorMessages } from '@/shared/constants/messages';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const logger = new Logger(AllExceptionsFilter.name);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = ErrorMessages.internal;
    let stack = undefined;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null && 'message' in res) {
        message = (res as any).message;
      }
      stack = exception.stack;
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    const simpleStack = simplifyStack(stack);
    logger.error(message, simpleStack);

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}

function simplifyStack(stack?: string): string | undefined {
  if (!stack) return undefined;
  const lines = stack
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const messageLine =
    lines.find((line) => line.includes('Exception')) ?? lines[0];

  const frame = lines.find(
    (line) => !line.includes('node_modules') && /^[a-zA-Z]:\\/.test(line),
  );

  return frame ? `${messageLine}\n${frame}` : messageLine;
}
