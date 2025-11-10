"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.Logger = exports.formatError = exports.NotificationService = exports.NotificationType = void 0;
/**
 * Notification/Response types for consistent messaging
 */
var NotificationType;
(function (NotificationType) {
    NotificationType["SUCCESS"] = "success";
    NotificationType["ERROR"] = "error";
    NotificationType["WARNING"] = "warning";
    NotificationType["INFO"] = "info";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
/**
 * Notification utility class for consistent API responses
 */
class NotificationService {
    /**
     * Send success response
     */
    static success(res, message, data, statusCode = 200) {
        const response = {
            success: true,
            type: NotificationType.SUCCESS,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
        return res.status(statusCode).json(response);
    }
    /**
     * Send error response
     */
    static error(res, message, statusCode = 500, errorCode, errorDetails) {
        const response = {
            success: false,
            type: NotificationType.ERROR,
            message,
            error: {
                code: errorCode,
                details: errorDetails,
            },
            timestamp: new Date().toISOString(),
        };
        return res.status(statusCode).json(response);
    }
    /**
     * Send warning response
     */
    static warning(res, message, data, statusCode = 200) {
        const response = {
            success: true,
            type: NotificationType.WARNING,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
        return res.status(statusCode).json(response);
    }
    /**
     * Send info response
     */
    static info(res, message, data, statusCode = 200) {
        const response = {
            success: true,
            type: NotificationType.INFO,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
        return res.status(statusCode).json(response);
    }
    /**
     * Send validation error response
     */
    static validationError(res, message, validationErrors) {
        return this.error(res, message, 400, 'VALIDATION_ERROR', validationErrors);
    }
    /**
     * Send not found error
     */
    static notFound(res, resource = 'Resource') {
        return this.error(res, `${resource} not found`, 404, 'NOT_FOUND');
    }
    /**
     * Send unauthorized error
     */
    static unauthorized(res, message = 'Unauthorized') {
        return this.error(res, message, 401, 'UNAUTHORIZED');
    }
    /**
     * Send forbidden error
     */
    static forbidden(res, message = 'Forbidden') {
        return this.error(res, message, 403, 'FORBIDDEN');
    }
    /**
     * Send conflict error
     */
    static conflict(res, message, details) {
        return this.error(res, message, 409, 'CONFLICT', details);
    }
    /**
     * Send internal server error
     */
    static serverError(res, message = 'Internal server error', error) {
        const errorDetails = error ? {
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        } : undefined;
        return this.error(res, message, 500, 'INTERNAL_ERROR', errorDetails);
    }
}
exports.NotificationService = NotificationService;
/**
 * Helper function to format error objects consistently
 */
const formatError = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unexpected error occurred';
};
exports.formatError = formatError;
/**
 * Logger utility for consistent logging
 */
class Logger {
    static formatMessage(level, message, context) {
        const timestamp = new Date().toISOString();
        const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
        return `[${timestamp}] [${level}] ${message}${contextStr}`;
    }
    static info(message, context) {
        console.log(this.formatMessage('INFO', message, context));
    }
    static success(message, context) {
        console.log(this.formatMessage('SUCCESS', message, context));
    }
    static warning(message, context) {
        console.warn(this.formatMessage('WARNING', message, context));
    }
    static error(message, error, context) {
        const errorDetails = error instanceof Error ? {
            message: error.message,
            stack: error.stack,
        } : error;
        console.error(this.formatMessage('ERROR', message, { ...context, error: errorDetails }));
    }
    static debug(message, context) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(this.formatMessage('DEBUG', message, context));
        }
    }
}
exports.Logger = Logger;
/**
 * Async error handler wrapper for express routes
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
