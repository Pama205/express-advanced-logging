# Express Advanced Logging Middleware

[![CI/CD](https://github.com/tu-usuario/express-advanced-logging/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/tu-usuario/express-advanced-logging/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Middleware de logging avanzado para Express con TypeScript que genera logs estructurados en formato JSON con metadata útil.

## Características

- Logs estructurados en formato JSON (ideal para ELK/Grafana)
- Filtrado de datos sensibles (contraseñas, tokens, etc.)
- Integración con Winston
- Correlación de requests (ID único por petición)
- Registro de:
  - Tiempo de respuesta
  - User-agent
  - IP del cliente
  - Errores con stack traces
  - Cuerpo de la petición/respuesta (filtrado)

## Instalación

```bash
npm install express-advanced-logging
```

## Uso Básico

```bash
import express from 'express';
import { createLogger, advancedLoggingMiddleware } from 'express-advanced-logging';

const app = express();
const logger = createLogger('my-app');

app.use(express.json());
app.use(advancedLoggingMiddleware(logger, {
  sensitiveFields: ['password', 'token'],
}));

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(3000);
```

## Opciones de Configuración

Opción	Tipo	Por defecto	Descripción
sensitiveFields	string[]	[]	Campos sensibles a filtrar en los logs
logRequests	boolean	true	Habilitar logging de requests
logResponses	boolean	true	Habilitar logging de responses
logErrors	boolean	true	Habilitar logging de errores

## Ejemplo de Log

```bash
{
  "level": "info",
  "message": "Incoming request",
  "service": "my-app",
  "timestamp": "2023-10-25T12:00:00.000Z",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "url": "/login",
  "headers": {
    "host": "localhost:3000",
    "user-agent": "curl/7.68.0"
  },
  "body": {
    "username": "testuser",
    "password": "***REDACTED***"
  },
  "userAgent": "curl/7.68.0",
  "ip": "::1"
}
```

## Contribución
Las contribuciones son bienvenidas. Por favor abre un issue o PR siguiendo las guías de contribución.

## Licencia
MIT