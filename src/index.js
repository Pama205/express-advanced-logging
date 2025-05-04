"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// express-advanced-logging/src/index.ts
var express_1 = require("express");
var logger_config_1 = require("./config/logger.config");
var logging_middleware_1 = require("./middleware/logging.middleware");
var app = (0, express_1.default)();
var port = 3000;
// Configuración del logger
var logger = (0, logger_config_1.createLogger)('express-app');
// Middleware para parsear JSON
app.use(express_1.default.json());
// Middleware de logging avanzado
app.use((0, logging_middleware_1.advancedLoggingMiddleware)(logger, {
    sensitiveFields: ['password', 'token', 'authorization'],
    logRequests: true,
    logResponses: true,
    logErrors: true,
}));
// Ruta de ejemplo
app.get('/', function (req, res) {
    res.json({ message: 'Hello World!', correlationId: req.correlationId });
});
// Ruta con datos sensibles
app.post('/login', function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password;
    res.json({ username: username, token: 'secret-token' });
});
// Manejo de errores
app.use(function (err, req, res, next) {
    req.app.get('errorHandler')(err);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.listen(port, function () {
    logger.info("Server running at http://localhost:".concat(port));
});
