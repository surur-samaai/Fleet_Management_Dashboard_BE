import { db } from '../firebase';
import { Vehicle, CreateVehicleDTO, UpdateVehicleDTO } from '../models/vehicle.model';

const vehiclesCollection = db.collection('vehicles');

class VehicleService {
    async createVehicle(vehicleData: CreateVehicleDTO): Promise<Vehicle> {
        const vehicle: Vehicle = {
            ...vehicleData,
            status: vehicleData.status || 'available',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await vehiclesCollection.add(vehicle);
        return { ...vehicle, id: docRef.id };
    }

    async getAllVehicles(): Promise<Vehicle[]> {
        const snapshot = await vehiclesCollection.get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Vehicle));
    }

    async getVehicleById(id: string): Promise<Vehicle | null> {
        const doc = await vehiclesCollection.doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as Vehicle;
    }

    async updateVehicle(id: string, updateData: UpdateVehicleDTO): Promise<Vehicle | null> {
        const docRef = vehiclesCollection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) return null;

        const updates = {
            ...updateData,
            updatedAt: new Date()
        };

        await docRef.update(updates);
        const updated = await docRef.get();
        return { id: updated.id, ...updated.data() } as Vehicle;
    }

    async deleteVehicle(id: string): Promise<boolean> {
        const doc = await vehiclesCollection.doc(id).get();
        if (!doc.exists) return false;

        await vehiclesCollection.doc(id).delete();
        return true;
    }

    async getAvailableVehicles(): Promise<Vehicle[]> {
        const snapshot = await vehiclesCollection
            .where('status', '==', 'available')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Vehicle));
    }
}

export default new VehicleService();