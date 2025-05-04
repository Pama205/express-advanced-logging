"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
// express-advanced-logging/src/config/logger.config.ts
var winston_1 = require("winston");
var _a = winston_1.default.format, combine = _a.combine, timestamp = _a.timestamp, json = _a.json, errors = _a.errors;
var createLogger = function (serviceName) {
    return winston_1.default.createLogger({
        level: 'info',
        defaultMeta: { service: serviceName },
        format: combine(errors({ stack: true }), timestamp(), json()),
        transports: [
            new winston_1.default.transports.Console(),
            new winston_1.default.transports.File({ filename: 'logs/combined.log' }),
            new winston_1.default.transports.File({
                filename: 'logs/error.log',
                level: 'error'
            }),
        ],
    });
};
exports.createLogger = createLogger;
