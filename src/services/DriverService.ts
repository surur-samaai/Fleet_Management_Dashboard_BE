import { db } from "../firebase";
import { Driver } from "../models/Driver";

export default class DriverService {
  static async createDriver(data: Driver) {
    const ref = await db.collection("drivers").add(data);
    return { id: ref.id, ...data };
  }

  static async getDriverById(id: string) {
    const doc = await db.collection("drivers").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Driver;
  }

  static async getAllDrivers() {
    const snapshot = await db.collection("drivers").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Driver[];
  }

  static async updateDriver(id: string, data: Partial<Driver>) {
    await db.collection("drivers").doc(id).update(data);
  }

  static async deleteDriver(id: string) {
    await db.collection("drivers").doc(id).delete();
  }
}
