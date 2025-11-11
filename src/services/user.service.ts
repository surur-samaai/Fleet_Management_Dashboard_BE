import { firestore } from "firebase-admin";
import { usersCollection, auth } from "../firebase";
import { User, CreateUserDTO, UpdateUserDTO } from "../models/user.model";
import { Vehicle } from "../models/vehicle.model";

class userService {
    private collection = usersCollection;

    // Create (driver)
    public async createUser(userData: CreateUserDTO): Promise<User> {
        const { email, password, role, ...firestoreData } = userData;

        // Create user in Firebase Auth
        const userRecord = await auth.createUser({ email, password });
        const uid = userRecord.uid;

        // Create corresponding document in Firestore (Driver)
        const newUser: Omit<User, 'id'> = {
            ...firestoreData,
            email,
            role,
            assignedVehicleId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await this.collection.doc(uid).set(newUser);

        return { id: uid, ...newUser } as User;
    }

    // Read (All Drivers)
    public async getAllUsers(): Promise<User[]> {
        const snapshot = await this.collection.where('role', '==', 'driver').get();
        if (snapshot.empty) return [];

        return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as User) }));
    }

    // Read (One Driver)
    public async getUserById(id: string): Promise<User | null> {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) return null;

        return { id: doc.id, ...doc.data() } as User;
    }

    // Read (Available Drivers)
    public async getAvailableDrivers(): Promise<User[]> {
        const snapshot = await this.collection
            .where('role', '==', 'driver')
            .where('assignedVehicleId', '==', null)
            .get();
        if (snapshot.empty) return [];

        return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as User) }));
    }

    // Update
    public async updateUser(id: string, updateData: UpdateUserDTO): Promise<User | null> {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) return null;

        const finalUpdate: UpdateUserDTO & { updatedAt: Date } = {
            ...updateData,
            updatedAt: new Date(),
        };

        await docRef.update(finalUpdate);

        const updatedDoc = await docRef.get();
        return { id: updatedDoc.id, ...updatedDoc.data() } as User;
    }

    // Delete
    public async deleteUser(id: string): Promise<boolean> {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return false;

        //Delete user from Firebase Auth
        await auth.deleteUser(id);

        // Delete user document from Firestore
        await docRef.delete();

        return true;
    }
}

export default new userService();