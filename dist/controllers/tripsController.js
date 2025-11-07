"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTripHistory = exports.getActiveTrip = exports.endTrip = exports.startTrip = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
/**
 * Start a new trip
 * POST /api/trips/start
 * Body: { vehicleId: string, startLocation?: { lat: number, lng: number, address?: string } }
 */
const startTrip = async (req, res) => {
    try {
        const { vehicleId, startLocation } = req.body;
        // Validate required fields
        if (!vehicleId) {
            res.status(400).json({
                success: false,
                message: 'Vehicle ID is required'
            });
            return;
        }
        // TODO: Replace with authenticated user once auth is implemented
        // const driverId = req.user.id;
        const driverId = req.body.driverId || 'placeholder-driver-id';
        // Check if driver already has an active trip
        const existingActiveTrip = await prisma_1.default.trip.findFirst({
            where: {
                driverId,
                status: 'active',
            },
        });
        if (existingActiveTrip) {
            res.status(400).json({
                success: false,
                message: 'Driver already has an active trip',
                data: { activeTripId: existingActiveTrip.id },
            });
            return;
        }
        // Check if vehicle is available
        const vehicle = await prisma_1.default.vehicle.findUnique({
            where: { id: vehicleId },
        });
        if (!vehicle) {
            res.status(404).json({
                success: false,
                message: 'Vehicle not found',
            });
            return;
        }
        if (vehicle.status !== 'available') {
            res.status(400).json({
                success: false,
                message: `Vehicle is currently ${vehicle.status}`,
            });
            return;
        }
        // Create new trip
        const trip = await prisma_1.default.trip.create({
            data: {
                driverId,
                vehicleId,
                startLocation: startLocation || null,
                status: 'active',
            },
            include: {
                driver: {
                    select: { id: true, name: true, email: true },
                },
                vehicle: {
                    select: { id: true, plateNumber: true, model: true },
                },
            },
        });
        // Update vehicle status to in-use
        await prisma_1.default.vehicle.update({
            where: { id: vehicleId },
            data: { status: 'in-use' },
        });
        res.status(201).json({
            success: true,
            message: 'Trip started successfully',
            data: trip,
        });
    }
    catch (error) {
        console.error('Error starting trip:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.startTrip = startTrip;
/**
 * End an active trip
 * POST /api/trips/end
 * Body: { tripId: string, endLocation?: { lat: number, lng: number, address?: string }, distance?: number }
 */
const endTrip = async (req, res) => {
    try {
        const { tripId, endLocation, distance } = req.body;
        // Validate required fields
        if (!tripId) {
            res.status(400).json({
                success: false,
                message: 'Trip ID is required',
            });
            return;
        }
        // TODO: Replace with authenticated user once auth is implemented
        // const driverId = req.user.id;
        const driverId = req.body.driverId || 'placeholder-driver-id';
        // Find the trip
        const trip = await prisma_1.default.trip.findUnique({
            where: { id: tripId },
            include: { vehicle: true },
        });
        if (!trip) {
            res.status(404).json({
                success: false,
                message: 'Trip not found',
            });
            return;
        }
        // Verify trip belongs to driver
        if (trip.driverId !== driverId) {
            res.status(403).json({
                success: false,
                message: 'Unauthorized to end this trip',
            });
            return;
        }
        // Check if trip is already completed
        if (trip.status === 'completed') {
            res.status(400).json({
                success: false,
                message: 'Trip is already completed',
            });
            return;
        }
        if (trip.status === 'cancelled') {
            res.status(400).json({
                success: false,
                message: 'Trip is cancelled',
            });
            return;
        }
        // Update trip
        const updatedTrip = await prisma_1.default.trip.update({
            where: { id: tripId },
            data: {
                endTime: new Date(),
                endLocation: endLocation || null,
                distance: distance || null,
                status: 'completed',
            },
            include: {
                driver: {
                    select: { id: true, name: true, email: true },
                },
                vehicle: {
                    select: { id: true, plateNumber: true, model: true },
                },
            },
        });
        // Update vehicle status back to available
        await prisma_1.default.vehicle.update({
            where: { id: trip.vehicleId },
            data: { status: 'available' },
        });
        res.status(200).json({
            success: true,
            message: 'Trip ended successfully',
            data: updatedTrip,
        });
    }
    catch (error) {
        console.error('Error ending trip:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.endTrip = endTrip;
/**
 * Get active trip for driver
 * GET /api/trips/active
 */
const getActiveTrip = async (req, res) => {
    try {
        // TODO: Replace with authenticated user once auth is implemented
        // const driverId = req.user.id;
        const driverId = req.query.driverId || 'placeholder-driver-id';
        const activeTrip = await prisma_1.default.trip.findFirst({
            where: {
                driverId,
                status: 'active',
            },
            include: {
                driver: {
                    select: { id: true, name: true, email: true },
                },
                vehicle: {
                    select: { id: true, plateNumber: true, model: true },
                },
            },
        });
        if (!activeTrip) {
            res.status(404).json({
                success: false,
                message: 'No active trip found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: activeTrip,
        });
    }
    catch (error) {
        console.error('Error getting active trip:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getActiveTrip = getActiveTrip;
/**
 * Get trip history for driver
 * GET /api/trips/history
 */
const getTripHistory = async (req, res) => {
    try {
        // TODO: Replace with authenticated user once auth is implemented
        // const driverId = req.user.id;
        const driverId = req.query.driverId || 'placeholder-driver-id';
        const { limit = '10', offset = '0' } = req.query;
        const trips = await prisma_1.default.trip.findMany({
            where: {
                driverId,
                status: {
                    in: ['completed', 'cancelled'],
                },
            },
            include: {
                vehicle: {
                    select: { id: true, plateNumber: true, model: true },
                },
            },
            orderBy: {
                startTime: 'desc',
            },
            take: parseInt(limit),
            skip: parseInt(offset),
        });
        const totalCount = await prisma_1.default.trip.count({
            where: {
                driverId,
                status: {
                    in: ['completed', 'cancelled'],
                },
            },
        });
        res.status(200).json({
            success: true,
            data: {
                trips,
                pagination: {
                    total: totalCount,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                },
            },
        });
    }
    catch (error) {
        console.error('Error getting trip history:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getTripHistory = getTripHistory;
