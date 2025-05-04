"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCorrelationId = void 0;
// express-advanced-logging/src/utils/correlation-id.util.ts
var uuid_1 = require("uuid");
var generateCorrelationId = function () {
    return (0, uuid_1.v4)();
};
exports.generateCorrelationId = generateCorrelationId;
