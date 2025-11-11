import Joi from 'joi';
import { CreateUserDTO, UpdateUserDTO } from '../models/user.model';

// Schema for creating a new user/driver (CreateUserDTO)
export const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid('admin', 'driver').required(),
    driverLicenseNumber: Joi.string().required(),
    contactNumber: Joi.string().required(),
});

// Schema for updating an existing user/driver (UpdateUserDTO)
export const updateUserSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    password: Joi.string().min(6).optional(),
    driverLicenseNumber: Joi.string().optional(),
    contactNumber: Joi.string().optional(),
    assignedVehicleId: Joi.string().allow(null).optional(),
});