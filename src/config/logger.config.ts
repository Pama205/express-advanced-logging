// express-advanced-logging/src/config/logger.config.ts
import * as winston from 'winston';

const { combine, timestamp, json, errors } = winston.format;

export const createLogger = (serviceName: string): winston.Logger => {
  return winston.createLogger({
    level: 'info',
    defaultMeta: { service: serviceName },
    format: combine(
      errors({ stack: true }),
      timestamp(),
      json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs/combined.log' }),
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error' 
      }),
    ],
  });
};

// Exporta el tipo Logger completo de winston
export type Logger = winston.Logger;