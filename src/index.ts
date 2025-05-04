// src/index.ts
import express from 'express';
import { createLogger } from './config/logger.config';
import { advancedLoggingMiddleware } from './middleware/logging.middleware';

// Configuración inicial
const app = express();
const port = parseInt(process.env['PORT'] || '3000', 10);
const environment = process.env['NODE_ENV'] || 'development';
const logger = createLogger('express-app');

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging avanzado
app.use(
  advancedLoggingMiddleware(logger, {
    sensitiveFields: ['password', 'token', 'authorization'],
    logRequests: true,
    logResponses: true,
    logErrors: true
  })
);

// Ruta de salud
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    environment,
    timestamp: new Date().toISOString()
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
    correlationId: req['correlationId'] // Usando el correlationId añadido por el middleware
  });
});

// Ruta de ejemplo con datos sensibles
app.post('/login', (req, res) => {
  const { username } = req.body; // password es filtrado por el middleware
  res.json({
    username,
    token: 'sample-token', // Este sería filtrado en los logs
    correlationId: req['correlationId']
  });
});

// Ruta para probar errores
app.get('/error-test', () => {
  throw new Error('Error de prueba intencional');
});

// Manejador de errores global
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const correlationId = req['correlationId'] || 'unknown';
  const errorHandler = req.app.get('errorHandler');
  
  if (errorHandler) {
    errorHandler(err);
  } else {
    logger.error('Error no manejado', {
      error: {
        name: err.name,
        message: err.message,
        stack: environment === 'development' ? err.stack : undefined
      },
      request: {
        method: req.method,
        url: req.originalUrl,
        correlationId
      }
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    correlationId,
    ...(environment === 'development' && { details: err.message })
  });
});

// Iniciar servidor solo si no estamos en entorno de pruebas
if (environment !== 'test') {
  app.listen(port, '0.0.0.0', () => {
    logger.info(`Servidor Express iniciado en el puerto ${port}`);
    logger.info(`Entorno: ${environment}`);
    logger.info(`URL: http://localhost:${port}`);
  });
}

export { app };