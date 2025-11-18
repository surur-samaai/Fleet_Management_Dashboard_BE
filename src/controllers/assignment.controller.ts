//src/controllers/assignment.controller.ts

import { Request, Response } from 'express';
import { AssignmentService } from '../services/assignment.service';
import { AuthRequest } from '../middleware/auth';
import { CustomError } from '../utils/error';

// Handler for POST /api/assignment

export const assignDriverVehicle = async (req: AuthRequest, res: Response): Promise<void> =>{
    try {
        const { driverId, vehicleId } = req.body;

        // The service handles the transaction and validation
        await AssignmentService.assign({ driverId, vehicleId });

        res.status(200).json({
            message: 'Driver successfully assigned to vehicle.',
            assignment: { driverId, vehicleId }
        });

    } catch (error){
        if (error instanceof CustomError) {
            // Catches 409 Conflict errors from the service
            res.status(error.code).json({ message:
                error.message });
        } else {
            console.error('Error assigning driver/vehicle:', error);
            res.status(500).json({ message: 'Internal server error during assignment.'});
        }
    }
};

// Handler for DELETE /api/assignment

export const unassignDriverVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { driverId, vehicleId } = req.body;

        await AssignmentService.unassign({ driverId, vehicleId });

        res.status(200).json({
            message: 'Driver successfully unassigned from vehicle.',
            assignment: { driverId, vehicleId }
        });

    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).json({ message: error.message });
        } else {
            console.error('Error unassigning driver/vehicle:', error);
            res.status(500).json({ message: 'Internal server error during unassignment.'});
        }
    }
};