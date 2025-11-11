import { db, adminApp, auth } from './firebase';

async function testConnection() {
    try {
        // Test Firestore
        const snapshot = await db.collection('user_roles').get();
        console.log('Firestore connection successful!');
        console.log('Documents in user_roles:', snapshot.size);

        // Test Auth
        const users = await auth.listUsers(1);
        console.log('Auth connection successful!');
        console.log('User count:', users.users.length);

    } catch (error) {
        console.error('Connection test failed:', error);
        process.exit(1);
    }
}

testConnection();