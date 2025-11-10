// src/utils/notification.ts
import { Response } from 'express';

/**
 * Notification/Response types for consistent messaging
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Standard API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  type: NotificationType;
  message: string;
  data?: T;
  error?: {
    code?: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * Notification utility class for consistent API responses
 */
export class NotificationService {
  /**
   * Send success response
   */
  static success<T = any>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
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
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errorCode?: string,
    errorDetails?: any
  ): Response {
    const response: ApiResponse = {
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
  static warning<T = any>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
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
  static info<T = any>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
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
  static validationError(
    res: Response,
    message: string,
    validationErrors: any[]
  ): Response {
    return this.error(res, message, 400, 'VALIDATION_ERROR', validationErrors);
  }

  /**
   * Send not found error
   */
  static notFound(res: Response, resource: string = 'Resource'): Response {
    return this.error(res, `${resource} not found`, 404, 'NOT_FOUND');
  }

  /**
   * Send unauthorized error
   */
  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, 401, 'UNAUTHORIZED');
  }

  /**
   * Send forbidden error
   */
  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, 403, 'FORBIDDEN');
  }

  /**
   * Send conflict error
   */
  static conflict(res: Response, message: string, details?: any): Response {
    return this.error(res, message, 409, 'CONFLICT', details);
  }

  /**
   * Send internal server error
   */
  static serverError(
    res: Response,
    message: string = 'Internal server error',
    error?: Error
  ): Response {
    const errorDetails = error ? {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    } : undefined;

    return this.error(res, message, 500, 'INTERNAL_ERROR', errorDetails);
  }
}

/**
 * Helper function to format error objects consistently
 */
export const formatError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

/**
 * Logger utility for consistent logging
 */
export class Logger {
  private static formatMessage(level: string, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }

  static info(message: string, context?: any): void {
    console.log(this.formatMessage('INFO', message, context));
  }

  static success(message: string, context?: any): void {
    console.log(this.formatMessage('SUCCESS', message, context));
  }

  static warning(message: string, context?: any): void {
    console.warn(this.formatMessage('WARNING', message, context));
  }

  static error(message: string, error?: any, context?: any): void {
    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
    } : error;
    
    console.error(this.formatMessage('ERROR', message, { ...context, error: errorDetails }));
  }

  static debug(message: string, context?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('DEBUG', message, context));
    }
  }
}

/**
 * Async error handler wrapper for express routes
 */
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
