import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winston: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const reqId = req.header('x-request-id') ?? nanoid(10);
    res.setHeader('x-request-id', reqId);

    // adiciona reqId em todos os logs desse request (child logger)
    const log = this.winston.child({
      reqId,
      path: req.path,
      method: req.method,
    });

    log.info('Incoming request');

    res.on('finish', () => {
      const ms = Date.now() - start;
      log.info('Request completed', { statusCode: res.statusCode, ms });
    });

    next();
  }
}
