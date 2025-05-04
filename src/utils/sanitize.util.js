"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeData = void 0;
// express-advanced-logging/src/utils/sanitize.util.ts
var sanitizeData = function (data, sensitiveFields) {
    if (!data || typeof data !== 'object') {
        return data;
    }
    var sanitizedData = __assign({}, data);
    for (var _i = 0, sensitiveFields_1 = sensitiveFields; _i < sensitiveFields_1.length; _i++) {
        var field = sensitiveFields_1[_i];
        if (sanitizedData[field]) {
            sanitizedData[field] = '***REDACTED***';
        }
    }
    return sanitizedData;
};
exports.sanitizeData = sanitizeData;
