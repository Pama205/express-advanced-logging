//src/utils/sanitize.util.ts
export const sanitizeData = <T extends Record<string, unknown>>(
  data: T,
  sensitiveFields: string[]
): T => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return data;
  }

  const sanitizedData: Record<string, unknown> = { ...data };

  sensitiveFields.forEach(field => {
    if (field in sanitizedData) {
      sanitizedData[field] = '***REDACTED***';
    }
  });

  return sanitizedData as T;
};