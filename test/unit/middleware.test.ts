// test/unit/middleware.test.ts
import type { Request, Response } from 'express';
import { advancedLoggingMiddleware } from '../../src/middleware/logging.middleware';
import type { Logger } from '../../src/config/logger.config';

const createMockLogger = (): Logger => {
  return {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    silly: jest.fn(),
    log: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
    close: jest.fn(),
    level: 'info',
    format: jest.fn(),
    transports: [],
    exitOnError: false,
    silent: false,
    levels: {},
    exceptions: {},
    rejections: {},
    profilers: {},
    child: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    emit: jest.fn(),
    off: jest.fn(),
    configure: jest.fn(),
    query: jest.fn(),
    stream: jest.fn(),
    startTimer: jest.fn(),
    addColors: jest.fn()
  } as unknown as Logger;
};

describe('AdvancedLoggingMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let mockLogger: Logger;
  let mockApp: {
    get: jest.Mock,
    set: jest.Mock,
    use: jest.Mock,
    listen: jest.Mock,
    errorHandler?: jest.Mock
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockLogger = createMockLogger();
    const errorHandler = jest.fn();
    
    mockApp = {
      get: jest.fn((key: string) => key === 'errorHandler' ? errorHandler : undefined),
      set: jest.fn((key: string, val: any) => {
        if (key === 'errorHandler') {
          mockApp.errorHandler = val;
        }
        return mockApp;
      }),
      use: jest.fn(),
      listen: jest.fn(),
      errorHandler: errorHandler
    };

    mockRequest = {
      method: 'GET',
      originalUrl: '/test-endpoint',
      headers: {},
      body: {},
      query: {},
      params: {},
      get: jest.fn(),
      ip: '127.0.0.1',
      app: mockApp as any
    };

    mockResponse = {
      statusCode: 200,
      getHeaders: jest.fn().mockReturnValue({}),
      setHeader: jest.fn(),
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn()
    };

    mockNext = jest.fn((err?: Error) => {
      if (err && mockApp.errorHandler) {
        mockApp.errorHandler(err);
      }
    });
  });

  describe('Error Handling', () => {
    it('should log errors when they occur', () => {
      const middleware = advancedLoggingMiddleware(mockLogger, { logErrors: true });
      const testError = new Error('Test error');
      
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      mockNext(testError);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Request error',
        expect.objectContaining({
          correlationId: expect.any(String),
          error: {
            name: 'Error',
            message: 'Test error',
            stack: expect.any(String)
          },
          request: {
            method: 'GET',
            url: '/test-endpoint'
          }
        })
      );

      expect(mockApp.errorHandler).toHaveBeenCalledWith(testError);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});