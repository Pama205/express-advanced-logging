// express-advanced-logging/src/utils/correlation-id.util.ts
import { v4 as uuidv4 } from 'uuid';

export const generateCorrelationId = (): string => {
  return uuidv4();
};