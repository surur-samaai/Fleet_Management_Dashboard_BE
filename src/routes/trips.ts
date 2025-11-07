// src/routes/trips.ts
import { Router } from 'express';
import { 
  startTrip, 
  endTrip, 
  getActiveTrip, 
  getTripHistory 
} from '../controllers/tripsController';

const router = Router();

/**
 * @route   POST /api/trips/start
 * @desc    Start a new trip
 * @access  Private (will require auth middleware later)
 * @body    { vehicleId: string, startLocation?: { lat, lng, address }, driverId?: string (temporary) }
 */
router.post('/start', startTrip);

/**
 * @route   POST /api/trips/end
 * @desc    End an active trip
 * @access  Private (will require auth middleware later)
 * @body    { tripId: string, endLocation?: { lat, lng, address }, distance?: number, driverId?: string (temporary) }
 */
router.post('/end', endTrip);

/**
 * @route   GET /api/trips/active
 * @desc    Get active trip for current driver
 * @access  Private (will require auth middleware later)
 * @query   driverId?: string (temporary - will use req.user.id later)
 */
router.get('/active', getActiveTrip);

/**
 * @route   GET /api/trips/history
 * @desc    Get trip history for current driver
 * @access  Private (will require auth middleware later)
 * @query   driverId?: string (temporary), limit?: number, offset?: number
 */
router.get('/history', getTripHistory);

export default router;
