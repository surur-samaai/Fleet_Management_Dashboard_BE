export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'driver';
    driverLicenseNumber: string;
    contactNumber: string;
    assignedVehicleId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateUserDTO = Omit<User, 'id' | 'role' | 'assignedVehicleId' | 'createdAt' | 'updatedAt'> & {
    password: string;
    role: 'admin' | 'driver';
};

export type UpdateUserDTO = Partial<Omit<User, 'id' | 'email' |'createdAt' | 'updatedAt' | 'assignedVehicleId'>>;