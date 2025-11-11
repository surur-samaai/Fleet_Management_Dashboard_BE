// src/middleware/validation.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validate = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true, // Allow fields not defined in the schema
  });

  if (error) {
    // Format error response to be cleaner
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ 
        message: 'Validation failed', 
        details: errors
    });
  }
  next();
};