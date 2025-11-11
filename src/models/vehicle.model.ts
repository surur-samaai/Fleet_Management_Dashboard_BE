export interface Vehicle {
    id?: string;
    make: string;
    model: string;
    licensePlate: string;
    vin: string;
    mileage: number;
    status: 'available' | 'in_use' | 'maintenance';
    currentDriverId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateVehicleDTO = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateVehicleDTO = Partial<CreateVehicleDTO>;