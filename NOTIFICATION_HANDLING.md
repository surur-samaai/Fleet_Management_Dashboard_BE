# Notification Handling & User Feedback System

## Overview
This module provides a centralized notification utility for standardizing API responses, error handling, and logging across the entire backend application. It ensures consistent message formatting that frontend clients can easily consume.

## Features

### 1. **Standardized API Responses**
All API responses follow a consistent format with:
- Success/failure status
- Response type (success, error, warning, info)
- User-friendly messages
- Optional data payload
- Error details when applicable
- Timestamps for tracking

### 2. **NotificationService Class**
A comprehensive utility for sending various types of responses:
- ✅ Success responses
- ❌ Error responses
- ⚠️ Warning responses
- ℹ️ Info responses
- Specialized error handlers (validation, not found, unauthorized, forbidden, conflict)

### 3. **Global Error Handler**
Centralized error handling middleware that:
- Catches all uncaught errors
- Formats errors consistently
- Handles Prisma database errors
- Logs errors with context
- Provides appropriate HTTP status codes

### 4. **Logger Utility**
Structured logging system for:
- Info messages
- Success notifications
- Warnings
- Errors with stack traces
- Debug messages (development only)

## API Response Format

### Standard Response Structure
```typescript
{
  success: boolean;           // true for successful operations
  type: string;               // 'success' | 'error' | 'warning' | 'info'
  message: string;            // Human-readable message
  data?: any;                 // Optional response payload
  error?: {                   // Present only for errors
    code?: string;            // Error code (e.g., 'VALIDATION_ERROR')
    details?: any;            // Additional error context
  };
  timestamp: string;          // ISO 8601 timestamp
}
```

### Example Success Response
```json
{
  "success": true,
  "type": "success",
  "message": "Trip started successfully",
  "data": {
    "id": "abc-123",
    "status": "active"
  },
  "timestamp": "2025-11-07T13:00:00.000Z"
}
```

### Example Error Response
```json
{
  "success": false,
  "type": "error",
  "message": "Vehicle not found",
  "error": {
    "code": "NOT_FOUND"
  },
  "timestamp": "2025-11-07T13:00:00.000Z"
}
```

### Example Validation Error Response
```json
{
  "success": false,
  "type": "error",
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  },
  "timestamp": "2025-11-07T13:00:00.000Z"
}
```

## Usage Examples

### 1. Success Response
```typescript
import { NotificationService } from '../utils/notification';

export const getUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  
  return NotificationService.success(
    res,
    'User retrieved successfully',
    user,
    200  // optional status code
  );
};
```

### 2. Error Responses
```typescript
// Not Found
if (!vehicle) {
  return NotificationService.notFound(res, 'Vehicle');
}

// Validation Error
if (!req.body.email) {
  return NotificationService.validationError(
    res,
    'Validation failed',
    [{ field: 'email', message: 'Email is required' }]
  );
}

// Unauthorized
if (!req.user) {
  return NotificationService.unauthorized(res, 'Please log in to continue');
}

// Forbidden
if (req.user.role !== 'admin') {
  return NotificationService.forbidden(res, 'Admin access required');
}

// Conflict
if (existingUser) {
  return NotificationService.conflict(
    res,
    'User with this email already exists',
    { email: req.body.email }
  );
}

// Server Error
try {
  // ... operation
} catch (error) {
  return NotificationService.serverError(
    res,
    'Failed to process request',
    error as Error
  );
}
```

### 3. Warning and Info Responses
```typescript
// Warning - operation succeeded but with caveats
return NotificationService.warning(
  res,
  'Trip ended successfully, but GPS data was incomplete',
  trip
);

// Info - informational response
return NotificationService.info(
  res,
  'Your account will expire in 7 days',
  { expirationDate: '2025-11-14' }
);
```

### 4. Custom Error with AppError Class
```typescript
import { AppError } from '../middleware/errorHandler';

// Throw custom error - will be caught by global error handler
if (trip.status === 'completed') {
  throw new AppError(
    'Trip is already completed',
    400,
    'TRIP_ALREADY_COMPLETED',
    { tripId: trip.id }
  );
}
```

### 5. Async Error Handling Wrapper
```typescript
import { asyncHandler } from '../utils/notification';

// Wrap async route handlers to automatically catch errors
export const createTrip = asyncHandler(async (req: Request, res: Response) => {
  const trip = await prisma.trip.create({ data: req.body });
  return NotificationService.success(res, 'Trip created', trip, 201);
  // Any thrown errors will be automatically caught and passed to error handler
});
```

### 6. Logging
```typescript
import { Logger } from '../utils/notification';

// Info logging
Logger.info('User logged in', { userId: user.id, email: user.email });

// Success logging
Logger.success('Database migration completed', { version: '1.0.0' });

// Warning logging
Logger.warning('Rate limit approaching', { userId: user.id, requestCount: 95 });

// Error logging
Logger.error('Payment processing failed', error, { orderId: '123', amount: 99.99 });

// Debug logging (only in development)
Logger.debug('Cache hit', { key: 'user:123', ttl: 3600 });
```

## HTTP Status Codes

The notification system uses standard HTTP status codes:

| Status Code | Method | Description |
|-------------|--------|-------------|
| 200 | `success()`, `warning()`, `info()` | OK - Request succeeded |
| 201 | `success()` | Created - Resource created successfully |
| 400 | `validationError()`, `error()` | Bad Request - Invalid input |
| 401 | `unauthorized()` | Unauthorized - Authentication required |
| 403 | `forbidden()` | Forbidden - Insufficient permissions |
| 404 | `notFound()` | Not Found - Resource doesn't exist |
| 409 | `conflict()` | Conflict - Resource already exists |
| 500 | `serverError()`, `error()` | Internal Server Error - Unexpected error |

## Error Codes

Common error codes used in the system:

- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error
- `INVALID_JSON` - Malformed JSON in request
- `FK_CONSTRAINT_FAILED` - Database foreign key violation

### Prisma Error Codes
- `P2002` - Unique constraint violation → Conflict (409)
- `P2025` - Record not found → Not Found (404)
- `P2003` - Foreign key constraint failed → Bad Request (400)

## Integration with Frontend

Frontend applications can easily consume these standardized responses:

### JavaScript/TypeScript Example
```typescript
// Frontend API call
async function startTrip(vehicleId: string) {
  try {
    const response = await fetch('/api/trips/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleId })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Show success notification
      showNotification(result.type, result.message);
      return result.data;
    } else {
      // Show error notification
      showNotification('error', result.message);
      console.error('Error:', result.error);
      return null;
    }
  } catch (error) {
    showNotification('error', 'Network error occurred');
    return null;
  }
}
```

### React Example
```tsx
import { useState } from 'react';

function useApiCall() {
  const [notification, setNotification] = useState(null);

  const callApi = async (url, options) => {
    const response = await fetch(url, options);
    const result = await response.json();
    
    // Display notification based on response type
    setNotification({
      type: result.type,
      message: result.message
    });
    
    return result;
  };

  return { callApi, notification };
}
```

## Files Created

### New Files
- `src/utils/notification.ts` - Core notification utilities
  - `NotificationService` class
  - `Logger` class
  - `asyncHandler` wrapper
  - Type definitions
  
- `src/middleware/errorHandler.ts` - Error handling middleware
  - `AppError` custom error class
  - `errorHandler` global middleware
  - `notFoundHandler` 404 middleware

### Modified Files
- `src/app.ts` - Registered error handlers and updated health check

## Best Practices

### DO ✅
- Use `NotificationService` for all API responses
- Use appropriate HTTP status codes
- Provide clear, user-friendly error messages
- Include relevant data in success responses
- Log errors with sufficient context
- Use `AppError` for predictable errors
- Wrap async handlers with `asyncHandler` or try-catch

### DON'T ❌
- Don't expose sensitive error details in production
- Don't use generic error messages
- Don't send stack traces to clients in production
- Don't forget to await async operations
- Don't mix response formats

## Testing

### Example Test (Jest)
```typescript
describe('NotificationService', () => {
  it('should send success response', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    NotificationService.success(mockRes as any, 'Success', { id: 1 });
    
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        type: 'success',
        message: 'Success',
        data: { id: 1 }
      })
    );
  });
});
```

## Environment Configuration

Error detail visibility depends on `NODE_ENV`:

```bash
# Development - shows full error details including stack traces
NODE_ENV=development

# Production - hides sensitive error details
NODE_ENV=production
```

## Next Steps

1. Integrate notification system into all existing controllers
2. Add request validation middleware with express-validator
3. Create notification UI components in frontend
4. Add monitoring/alerting for error rates
5. Implement error tracking service integration (e.g., Sentry)
6. Create API documentation with example responses

## Support

For questions or issues with the notification system, refer to:
- API response format specification
- Error code reference
- Frontend integration examples
