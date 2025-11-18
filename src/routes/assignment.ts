// scr/routes/assignment.ts

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { checkRole } from '../middleware/role';
import { fetchUserRole } from '../middleware/fetchUserRole';
import { validate } from '../middleware/validation.middleware';
import { createAssignmentSchema, deleteAssignmentSchema } from '../validators/assignment.validator';
import * as AssignmentController from '../controllers/assignment.controller';

const router = Router();
const adminAccess = [
    requireAuth,
    fetchUserRole,
    checkRole(['admin'])];

// This handles assignment logic and conflict validation

router.post(
    '/',
    adminAccess,
    validate(createAssignmentSchema),
    AssignmentController.assignDriverVehicle
);

// Function to unassign a driver/vehicle

router.delete(
    '/',
    adminAccess,
    validate(deleteAssignmentSchema),
    AssignmentController.unassignDriverVehicle
);

export default router;