// src/types/express/index.d.ts
import type { Request as ExpressRequest } from 'express';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

// Exporta el tipo extendido para uso externo
export type Request = ExpressRequest;