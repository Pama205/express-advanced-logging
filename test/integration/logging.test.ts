// test/integration/logging.test.ts
import request from 'supertest';
import { app } from '../../src';

describe('Logging Middleware Integration Tests', () => {
  describe('Request Logging', () => {
    it('should include correlation ID in response', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.headers['x-correlation-id']).toBeDefined();
      expect(response.body.correlationId).toBeDefined();
      expect(response.body.correlationId).toBe(response.headers['x-correlation-id']);
    });
  });

  describe('Sensitive Data Redaction', () => {
    it('should redact password fields in requests', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'secret' })
        .expect(200);

      expect(response.body.password).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    beforeAll(() => {
      // Configurar entorno de prueba
      process.env['NODE_ENV'] = 'test';
    });

    it('should return 500 for error-test endpoint', async () => {
      await request(app)
        .get('/error-test')
        .expect(500);
    });
  });
});