// src/middleware/role.ts

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth'; // Import the extended request interface

type UserRole = 'admin' | 'driver';

/**
 * Middleware factory to check if the authenticated user has one of the allowed roles.
 * @param allowedRoles - Array of roles permitted to access the resource.
 */
export const checkRole = (allowedRoles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        // 1. Check if user object (and thus role) is present
        if (!req.user) {
            // This case should be caught by verifyAuthToken, but it's a safe guard
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