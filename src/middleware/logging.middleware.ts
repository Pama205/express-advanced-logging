// src/middleware/logging.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../config/logger.config';
import { generateCorrelationId } from '../utils/correlation-id.util';

export interface LoggingOptions {
  sensitiveFields?: string[];
  logRequests?: boolean;
  logResponses?: boolean;
  logErrors?: boolean;
}

export const advancedLoggingMiddleware = (
  logger: Logger,
  options: LoggingOptions = {}
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const correlationId = generateCorrelationId();
    req.correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);

    if (options.logErrors) {
      const originalErrorHandler = req.app.get('errorHandler');
      
      const errorHandlerWrapper = (err: Error) => {
        logger.error('Request error', {
          correlationId,
          error: {
            name: err.name,
            message: err.message,
            stack: err.stack
          },
          request: {
            method: req.method,
            url: req.originalUrl
          }
        });

        if (originalErrorHandler) {
          originalErrorHandler(err);
        }
      };

      req.app.set('errorHandler', errorHandlerWrapper);
    }

    next();
  };
};