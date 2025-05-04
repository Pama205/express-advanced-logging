// src/compatibility-test.ts
import { setTimeout } from 'timers/promises';

// Eliminar la referencia a import.meta y reemplazar con:
export async function node22FeatureTest() {
  console.log('Testing Node.js 22 features...');
  await setTimeout(100);
  return {
    nodeVersion: process.version,
    features: {
      fetch: typeof fetch === 'function',
      webStreams: typeof ReadableStream === 'function'
    }
  };
}