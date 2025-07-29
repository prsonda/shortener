import { Injectable, NestMiddleware } from '@nestjs/common';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';

@Injectable()
export class SecureMiddleware implements NestMiddleware {
  async use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      await runMiddleware(
        req,
        res,
        helmet({
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", 'https:'],
              objectSrc: ["'none'"],
              upgradeInsecureRequests: [],
            },
          },
          referrerPolicy: { policy: 'no-referrer' },
          frameguard: { action: 'deny' },
          dnsPrefetchControl: { allow: false },
          crossOriginResourcePolicy: { policy: 'same-origin' },
          crossOriginEmbedderPolicy: true,
          crossOriginOpenerPolicy: { policy: 'same-origin' },
          hidePoweredBy: true,
        }),
      );

      await runMiddleware(req, res, hpp());
      await runMiddleware(req, res, compression());
      await runMiddleware(req, res, express.json({ limit: '1mb' }));
      await runMiddleware(
        req,
        res,
        express.urlencoded({ extended: true, limit: '1mb' }),
      );

      next();
    } catch (err) {
      next(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

function isPromise(obj: unknown): obj is Promise<unknown> {
  return !!obj && typeof (obj as { then?: unknown }).then === 'function';
}

function runMiddleware(
  req: express.Request,
  res: express.Response,
  fn: express.RequestHandler,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const maybePromise = fn(req, res, (result?: unknown) => {
      if (result instanceof Error) return reject(result);
      resolve();
    });

    if (isPromise(maybePromise)) {
      maybePromise
        .then(() => resolve())
        .catch((reason) =>
          reject(reason instanceof Error ? reason : new Error(String(reason))),
        );
    }
  });
}
