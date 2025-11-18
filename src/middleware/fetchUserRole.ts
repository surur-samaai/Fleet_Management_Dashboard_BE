// src/middleware/fetchUserRole.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { db as firestore } from '../firebase'; // Import your initialized Firestore instance
const userRolesCollection = firestore.collection('user_roles');
/**
 * Extends AuthRequest to include the 'user' object with role information.
 * This object is required by the checkRole middleware.
 */
export interface RoleAuthRequest extends AuthRequest {
    user?: {
        uid: string;
        role: 'admin' | 'driver';
    };
}
/**
 * Middleware that runs after authentication (requireAuth) to fetch the user's
 * role from Firestore and attach it to the request object.
 */
export const fetchUserRole = async (req: RoleAuthRequest, res: Response, next: NextFunction) => {
    // 1. Ensure requireAuth has run and attached the UID
    if (!req.uid) {
        // This is a safety check; should not happen if middleware order is correct
        return res.status(500).json({ message: 'Internal Error: User ID not attached by authentication middleware.' });
    }
    try {
        // 2. Fetch the user's role document from the 'user_roles' collection
        const roleSnapshot = await userRolesCollection.doc(req.uid).get();
        if (!roleSnapshot.exists) {
            // User is authenticated but has no role record—deny access
            return res.status(401).json({ message: 'Unauthorized: User role record not found in Firestore.' });
        }
        const roleData = roleSnapshot.data();
        // 3. Attach the full user object (with the role) to the request
        req.user = {
            uid: req.uid,
            role: roleData?.role as 'admin' | 'driver'
        };
        next();
    } catch (error) {
        console.error('Error fetching user role:', error);
        res.status(500).json({ message: 'Internal server error during role check.' });
    }
};
