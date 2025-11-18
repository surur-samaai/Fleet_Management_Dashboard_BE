// src/validators/assignment.validator.ts

import Joi from 'joi';
import { AssignmentRequestDTO } from '../dto/assignment.dto';

const assignmentSchema = Joi.object<AssignmentRequestDTO>({
    driverId: Joi.string().required().messages({
        'any.required': 'Driver ID is required for assignment.',
        'string.empty': 'Driver ID cannot be empty.'
    }),
    vehicleId: Joi.string().required().messages({
        'any.required': 'Vehicle ID os required for assignment.',
        'string.empty': 'Vehicle ID cannot be empty.'
    }),
});

export const createAssignmentSchema = assignmentSchema;
export const deleteAssignmentSchema = assignmentSchema;