"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/trips.ts
const express_1 = require("express");
const tripsController_1 = require("../controllers/tripsController");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/trips/start
 * @desc    Start a new trip
 * @access  Private (will require auth middleware later)
 * @body    { vehicleId: string, startLocation?: { lat, lng, address }, driverId?: string (temporary) }
 */
router.post('/start', tripsController_1.startTrip);
/**
 * @route   POST /api/trips/end
 * @desc    End an active trip
 * @access  Private (will require auth middleware later)
 * @body    { tripId: string, endLocation?: { lat, lng, address }, distance?: number, driverId?: string (temporary) }
 */
router.post('/end', tripsController_1.endTrip);
/**
 * @route   GET /api/trips/active
 * @desc    Get active trip for current driver
 * @access  Private (will require auth middleware later)
 * @query   driverId?: string (temporary - will use req.user.id later)
 */
router.get('/active', tripsController_1.getActiveTrip);
/**
 * @route   GET /api/trips/history
 * @desc    Get trip history for current driver
 * @access  Private (will require auth middleware later)
 * @query   driverId?: string (temporary), limit?: number, offset?: number
 */
router.get('/history', tripsController_1.getTripHistory);
exports.default = router;
