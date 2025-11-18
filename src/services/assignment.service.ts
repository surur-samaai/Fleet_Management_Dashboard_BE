//src/services/assignment.service

import { db as firestore } from '../firebase';
import { CustomError } from '../utils/error';
import { AssignmentRequestDTO } from '../dto/assignment.dto';
import { Vehicle } from '../models/vehicle.model';

const usersCollection = firestore.collection('users');
const vehiclesCollection = firestore.collection('vehicles')

export class AssignmentService {
    public static async assign(data: AssignmentRequestDTO): Promise<void> {
        const { driverId, vehicleId } = data;

        const driverRef = usersCollection.doc(driverId);
        const vehicleRef = vehiclesCollection.doc(vehicleId);

        await firestore.runTransaction(async (t) => {
            const driverSnapshot = await t.get(driverRef);
            const vehicleSnapshot = await t.get(vehicleRef);

            if (!driverSnapshot.exists) {
                throw new CustomError(`Driver with ID ${driverId} not found.`, 404);
            }
            if (!vehicleSnapshot.exists) {
                throw new CustomError(`Vehicle with ID ${vehicleId} not found`, 404);
            }

            const driverData = driverSnapshot.data();
            const vehicleData = vehicleSnapshot.data() as Vehicle;

            // Validation logic

            if (driverData?.assignedVehicleId) {
                throw new CustomError('Driver is already assigned to a vehicle.', 409);
            }
            if (vehicleData?.assignedDriverId) {
                throw new CustomError('Vehicle is already assigned to a driver.', 409);
            }
            if (vehicleData?.status !== 'available') {
                throw new CustomError(`Vehicle status is '${vehicleData?.status}'. Must be 'available'.`, 409);
            }

            // Driver Record
            t.update(driverRef, { assignedVehicleId: vehicleId });

            // Vehicle Record
            t.update(vehicleRef, { assignedDriverId: driverId, status: 'in_use' });
        });
    }

    public static async unassign(data: AssignmentRequestDTO): Promise<void> {
        const { driverId, vehicleId } = data;

        const driverRef = usersCollection.doc(driverId);
        const vehicleRef = vehiclesCollection.doc(vehicleId);

        await firestore.runTransaction(async (t) => {
            const driverSnapshot = await t.get(driverRef);
            const vehicleSnapshot = await t.get(vehicleRef);

            if (!driverSnapshot.exists || !vehicleSnapshot.exists) {

                throw new CustomError('Driver or Vehicle not found.', 404);
            }

            // Driver Record - clear assignment
            t.update(driverRef, { assignedVehicleId: null });

            // Vehicle Record - clear assignment and set status back
            t.update(vehicleRef, { assignedDriverId: null, status: 'available'});
        });
    }
}