// src/controllers/vehicle.controller.ts

import { Request, Response } from 'express';
import vehicleService from '../services/vehicle.service';

// Reusable function for error responses
const handleError = (res: Response, error: any, message: string = 'Internal Server Error', statusCode: number = 500) => {
    console.error(error);
    res.status(statusCode).json({ message, error: error.message });
};

// CREATE
export const createVehicle = async (req: Request, res: Response): Promise<void> => {
    try {
        const vehicle = await vehicleService.createVehicle(req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        handleError(res, error, 'Failed to create vehicle');
    }
};

// READ (All)
export const getAllVehicles = async (req: Request, res: Response): Promise<void> => {
    try {
        const vehicles = await vehicleService.getAllVehicles();
        res.status(200).json(vehicles);
    } catch (error) {
        handleError(res, error, 'Failed to fetch vehicles');
    }
};

// READ (One)
export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const vehicle = await vehicleService.getVehicleById(id);
        
        if (!vehicle) {
            res.status(404).json({ message: 'Vehicle not found' });
            return;
        }
        
        res.status(200).json(vehicle);
    } catch (error) {
        handleError(res, error, 'Failed to fetch vehicle');
    }
};

// READ (Available)
export const getAvailableVehicles = async (req: Request, res: Response): Promise<void> => {
    try {
        const vehicles = await vehicleService.getAvailableVehicles();
        res.status(200).json(vehicles);
    } catch (error) {
        handleError(res, error, 'Failed to fetch available vehicles');
    }
};

// UPDATE
export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const vehicle = await vehicleService.updateVehicle(id, req.body);
        
        if (!vehicle) {
            res.status(404).json({ message: 'Vehicle not found' });
            return;
        }
        
        res.status(200).json(vehicle);
    } catch (error) {
        handleError(res, error, 'Failed to update vehicle');
    }
};

// DELETE
export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const success = await vehicleService.deleteVehicle(id);
        
        if (!success) {
            res.status(404).json({ message: 'Vehicle not found' });
            return;
        }
        
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Failed to delete vehicle');
    }
};