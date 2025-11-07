# Trip Logging API

## Overview
This feature implements the Trip Logging API for the Fleet Management Dashboard backend. It allows drivers to start and end trips, track vehicle usage, and query trip history.

## Database Schema

### Models
- **User**: Driver and admin accounts
- **Vehicle**: Fleet vehicles with availability status
- **Trip**: Trip records with start/end times, locations, and distance

### Trip Status Values
- `active`: Trip is currently in progress
- `completed`: Trip has been successfully completed
- `cancelled`: Trip was cancelled

### Vehicle Status Values
- `available`: Vehicle is available for use
- `in-use`: Vehicle is currently being used in an active trip
- `maintenance`: Vehicle is under maintenance

## Setup Instructions

### 1. Ensure Database is Running
The project uses Prisma Postgres. Start the local database server:
```bash
npx prisma dev
```

### 2. Run Database Migrations
```bash
npx prisma migrate dev --name init_trip_logging
```

### 3. Generate Prisma Client (if not already done)
```bash
npx prisma generate
```

### 4. Seed Test Data (Optional)
You may want to create test users and vehicles to test the API:
```bash
# Create a seed script or manually insert via Prisma Studio
npx prisma studio
```

## API Endpoints

### 1. Start a Trip
**POST** `/api/trips/start`

**Request Body:**
```json
{
  "vehicleId": "uuid-of-vehicle",
  "startLocation": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "New York, NY"
  },
  "driverId": "placeholder-driver-id"  // Temporary - will use req.user.id after auth
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Trip started successfully",
  "data": {
    "id": "trip-uuid",
    "driverId": "driver-uuid",
    "vehicleId": "vehicle-uuid",
    "startTime": "2025-11-07T12:00:00.000Z",
    "endTime": null,
    "startLocation": { "lat": 40.7128, "lng": -74.0060, "address": "New York, NY" },
    "endLocation": null,
    "distance": null,
    "status": "active",
    "driver": {
      "id": "driver-uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "vehicle": {
      "id": "vehicle-uuid",
      "plateNumber": "ABC-123",
      "model": "Toyota Camry"
    }
  }
}
```

**Error Cases:**
- `400`: Vehicle ID missing, driver already has active trip, or vehicle not available
- `404`: Vehicle not found
- `500`: Server error

---

### 2. End a Trip
**POST** `/api/trips/end`

**Request Body:**
```json
{
  "tripId": "uuid-of-trip",
  "endLocation": {
    "lat": 40.7589,
    "lng": -73.9851,
    "address": "Times Square, NY"
  },
  "distance": 15.5,
  "driverId": "placeholder-driver-id"  // Temporary - will use req.user.id after auth
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Trip ended successfully",
  "data": {
    "id": "trip-uuid",
    "driverId": "driver-uuid",
    "vehicleId": "vehicle-uuid",
    "startTime": "2025-11-07T12:00:00.000Z",
    "endTime": "2025-11-07T14:30:00.000Z",
    "startLocation": { "lat": 40.7128, "lng": -74.0060 },
    "endLocation": { "lat": 40.7589, "lng": -73.9851 },
    "distance": 15.5,
    "status": "completed",
    "driver": { ... },
    "vehicle": { ... }
  }
}
```

**Error Cases:**
- `400`: Trip ID missing, trip already completed/cancelled
- `403`: Unauthorized (trip doesn't belong to driver)
- `404`: Trip not found
- `500`: Server error

---

### 3. Get Active Trip
**GET** `/api/trips/active?driverId=placeholder-driver-id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "trip-uuid",
    "status": "active",
    ...
  }
}
```

**Error Cases:**
- `404`: No active trip found
- `500`: Server error

---

### 4. Get Trip History
**GET** `/api/trips/history?driverId=placeholder-driver-id&limit=10&offset=0`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "trips": [
      {
        "id": "trip-uuid",
        "startTime": "2025-11-06T10:00:00.000Z",
        "endTime": "2025-11-06T12:00:00.000Z",
        "distance": 25.3,
        "status": "completed",
        "vehicle": { ... }
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 10,
      "offset": 0
    }
  }
}
```

## Authentication Integration (TODO)

Currently, the API uses placeholder `driverId` values passed in request body or query parameters. Once authentication is finalized:

1. Add authentication middleware to trip routes
2. Replace placeholder driverId with:
   ```typescript
   const driverId = req.user.id;
   ```
3. Remove `driverId` from request body/query validation
4. Update route protection in `src/routes/trips.ts`

## Testing

### Manual Testing with curl/Postman
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test starting a trip:
   ```bash
   curl -X POST http://localhost:4000/api/trips/start \
     -H "Content-Type: application/json" \
     -d '{
       "vehicleId": "test-vehicle-id",
       "driverId": "test-driver-id",
       "startLocation": {"lat": 40.7128, "lng": -74.0060}
     }'
   ```

3. Test ending a trip:
   ```bash
   curl -X POST http://localhost:4000/api/trips/end \
     -H "Content-Type: application/json" \
     -d '{
       "tripId": "trip-id-from-start",
       "driverId": "test-driver-id",
       "distance": 10.5
     }'
   ```

## Files Created/Modified

### New Files:
- `src/lib/prisma.ts` - Prisma client instance
- `src/controllers/tripsController.ts` - Trip business logic
- `src/routes/trips.ts` - Trip API routes
- `prisma/schema.prisma` - Database schema with User, Vehicle, Trip models

### Modified Files:
- `src/app.ts` - Registered trip routes
- `src/routes/users.ts` - Added basic export

## Next Steps

1. Run database migrations when ready
2. Create seed data for testing
3. Integrate authentication middleware
4. Add input validation with express-validator
5. Add unit/integration tests
6. Update frontend to consume these endpoints

## Notes

- The API follows RESTful conventions
- All responses use a consistent format: `{ success, message?, data?, error? }`
- Location data is stored as JSON (flexible for future enhancements)
- Vehicle status is automatically managed (available ↔ in-use)
- Trip history excludes active trips (only completed/cancelled)
