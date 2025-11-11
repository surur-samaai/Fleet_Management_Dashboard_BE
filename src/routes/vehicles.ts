// src/routes/vehicles.ts

import { Router } from 'express';
import * as VehicleController from '../controllers/vehicle.controller';
import { createVehicleSchema, updateVehicleSchema } from '../validators/vehicle.validator';
import { validate } from '../middleware/validation.middleware';
import { verifyAuthToken } from '../middleware/auth'; 
import { checkRole } from '../middleware/role'; 

const router = Router();

// Define the security array for Admin access
const adminAccess = [verifyAuthToken, checkRole(['admin'])];

// CRUD Endpoints for Vehicles (Admin only)
router.post('/', adminAccess, validate(createVehicleSchema), VehicleController.createVehicle);
router.get('/', adminAccess, VehicleController.getAllVehicles);
router.get('/available', adminAccess, VehicleController.getAvailableVehicles); 
router.get('/:id', adminAccess, VehicleController.getVehicleById);
router.put('/:id', adminAccess, validate(updateVehicleSchema), VehicleController.updateVehicle);
router.delete('/:id', adminAccess, VehicleController.deleteVehicle);

export default router;