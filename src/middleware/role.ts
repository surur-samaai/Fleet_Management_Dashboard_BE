// src/middleware/role.ts
import { Response, NextFunction } from 'express';
// Assuming AuthRequest and UserRole are defined or imported here
import { AuthRequest } from '../middleware/auth';
import { RoleAuthRequest } from '../middleware/fetchUserRole'; // Assuming you use the extended interface
// Define the UserRole type based on your system's roles
type UserRole = 'admin' | 'driver';
/**
 * Middleware factory to check if the authenticated user has one of the allowed roles.
 * It relies on the fetchUserRole middleware to attach the req.user object.
 * * FIX: The 'export const' ensures this function is available for named imports
 * in assignment.ts.
 */
export const checkRole = (allowedRoles: UserRole[]) => {
    // Use the extended interface to ensure req.user is available
    return (req: RoleAuthRequest, res: Response, next: NextFunction) => {
        // 1. Check if req.user object (which contains the role) is present
        // This check is now satisfied if fetchUserRole ran successfully
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Unauthorized: Role could not be determined.' });
        }
        const userRole = req.user.role;
        // 2. Check if the user's role is in the list of allowed roles
        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            // 403 Forbidden: The user is authenticated but lacks permission
            res.status(403).json({
                message: `Forbidden: Role '${userRole}' does not have access. Requires: ${allowedRoles.join(', ')}.`
            });
        }
    };
};