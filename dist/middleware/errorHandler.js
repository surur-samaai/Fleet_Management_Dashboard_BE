"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = exports.AppError = void 0;
const notification_1 = require("../utils/notification");
/**
 * Custom error class with status code
 */
class AppError extends Error {
    constructor(message, statusCode = 500, code, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * Global error handler middleware
 * Catches all errors thrown in the application and formats them consistently
 */
const errorHandler = (err, req, res, next) => {
    // Log the error
    notification_1.Logger.error('Error occurred', err, {
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
    });
    // Handle AppError instances
    if (err instanceof AppError) {
        notification_1.NotificationService.error(res, err.message, err.statusCode, err.code, err.details);
        return;
    }
    // Handle Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaError = err;
        switch (prismaError.code) {
            case 'P2002':
                notification_1.NotificationService.conflict(res, 'A record with this unique field already exists', { field: prismaError.meta?.target });
                return;
            case 'P2025':
                notification_1.NotificationService.notFound(res, 'Record');
                return;
            case 'P2003':
                notification_1.NotificationService.error(res, 'Foreign key constraint failed', 400, 'FK_CONSTRAINT_FAILED', prismaError.meta);
                return;
            default:
                notification_1.NotificationService.serverError(res, 'Database error occurred', err);
                return;
        }
    }
    // Handle validation errors (from express-validator or similar)
    if (err.name === 'ValidationError') {
        notification_1.NotificationService.validationError(res, 'Validation failed', err.errors || []);
        return;
    }
    // Handle JSON parsing errors
    if (err instanceof SyntaxError && 'body' in err) {
        notification_1.NotificationService.error(res, 'Invalid JSON in request body', 400, 'INVALID_JSON');
        return;
    }
    // Default to 500 server error
    notification_1.NotificationService.serverError(res, 'An unexpected error occurred', err);
};
exports.errorHandler = errorHandler;
/**
 * 404 Not Found handler
 * Should be placed after all routes
 */
const notFoundHandler = (req, res, next) => {
    notification_1.NotificationService.notFound(res, `Route ${req.method} ${req.path}`);
};
exports.notFoundHandler = notFoundHandler;
