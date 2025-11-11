import request from 'supertest';
import app from '../app';
import { auth } from '../firebase';

describe('Vehicle Endpoints', () => {
    let adminToken: string;
    let testVehicleId: string;

    beforeAll(async () => {
        // Login as admin user
        const adminUser = await auth.signInWithEmailAndPassword(
            'sibabalwelingani17@gmail.com',
            'Bts.army_7'
        );
        adminToken = await adminUser.user?.getIdToken();
    });

    // Test CREATE
    test('POST /api/vehicles - Create Vehicle', async () => {
        const response = await request(app)
            .post('/api/vehicles')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                make: 'Toyota',
                model: 'Corolla',
                licensePlate: 'ABC123GP',
                vin: '1HGCM82633A123456',
                mileage: 50000
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        testVehicleId = response.body.id;
    });

    // Test GET ALL
    test('GET /api/vehicles - Get All Vehicles', async () => {
        const response = await request(app)
            .get('/api/vehicles')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    // Test GET ONE
    test('GET /api/vehicles/:id - Get Vehicle by ID', async () => {
        const response = await request(app)
            .get(`/api/vehicles/${testVehicleId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testVehicleId);
    });

    // Test UPDATE
    test('PUT /api/vehicles/:id - Update Vehicle', async () => {
        const response = await request(app)
            .put(`/api/vehicles/${testVehicleId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                mileage: 55000,
                status: 'maintenance'
            });

        expect(response.status).toBe(200);
        expect(response.body.mileage).toBe(55000);
    });

    // Test GET AVAILABLE
    test('GET /api/vehicles/available - Get Available Vehicles', async () => {
        const response = await request(app)
            .get('/api/vehicles/available')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    // Test DELETE
    test('DELETE /api/vehicles/:id - Delete Vehicle', async () => {
        const response = await request(app)
            .delete(`/api/vehicles/${testVehicleId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
    });
});