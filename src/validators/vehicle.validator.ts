// src/validators/vehicle.validator.ts

import Joi from 'joi';

// Schema for creating a new vehicle
export const createVehicleSchema = Joi.object({
  make: Joi.string().required().messages({'any.required': 'Make is required.'}),
  model: Joi.string().required().messages({'any.required': 'Model is required.'}),
  licensePlate: Joi.string().required().messages({'any.required': 'License Plate is required.'}),
  vin: Joi.string().length(17).required().messages({
    'any.required': 'VIN is required.',
    'string.length': 'VIN must be 17 characters.'
  }),
  mileage: Joi.number().positive().integer().required().messages({
    'any.required': 'Mileage is required.',
    'number.positive': 'Mileage must be a positive number.'
  }),
});

// Schema for updating a vehicle
export const updateVehicleSchema = Joi.object({
  make: Joi.string().optional(),
  model: Joi.string().optional(),
  licensePlate: Joi.string().optional(),
  vin: Joi.string().length(17).optional(),
  mileage: Joi.number().positive().integer().optional(),
  status: Joi.string().valid('available', 'in_use', 'maintenance').optional(),
  currentDriverId: Joi.string().allow(null).optional(),
});