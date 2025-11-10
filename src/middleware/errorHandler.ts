// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { NotificationService, Logger } from '../utils/notification';

/**
 * Custom error class with status code
 */
export class AppError extends Error {
  statusCode: number;
  code?: string;
  details?: any;

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 * Catches all errors thrown in the application and formats them consistently
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  Logger.error('Error occurred', err, {
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
  });

  // Handle AppError instances
  if (err instanceof AppError) {
    NotificationService.error(
      res,
      err.message,
      err.statusCode,
      err.code,
      err.details
    );
    return;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    switch (prismaError.code) {
      case 'P2002':
        NotificationService.conflict(
          res,
          'A record with this unique field already exists',
          { field: prismaError.meta?.target }
        );
        return;
      
      case 'P2025':
        NotificationService.notFound(res, 'Record');
        return;
      
      case 'P2003':
        NotificationService.error(
          res,
          'Foreign key constraint failed',
          400,
          'FK_CONSTRAINT_FAILED',
          prismaError.meta
        );
        return;
      
      default:
        NotificationService.serverError(res, 'Database error occurred', err);
        return;
    }
  }

  // Handle validation errors (from express-validator or similar)
  if (err.name === 'ValidationError') {
    NotificationService.validationError(res, 'Validation failed', (err as any).errors || []);
    return;
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    NotificationService.error(res, 'Invalid JSON in request body', 400, 'INVALID_JSON');
    return;
  }

  // Default to 500 server error
  NotificationService.serverError(
    res,
    'An unexpected error occurred',
    err
  );
};

/**
 * 404 Not Found handler
 * Should be placed after all routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  NotificationService.notFound(res, `Route ${req.method} ${req.path}`);
};
