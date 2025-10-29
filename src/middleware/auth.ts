// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { auth } from '../firebase';

export interface AuthRequest extends Request {
  uid?: string;
  tokenClaims?: any;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const idToken = authHeader.split(' ')[1];
  try {
    const decoded = await auth.verifyIdToken(idToken);
    req.uid = decoded.uid;
    req.tokenClaims = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', error: String(err) });
  }
}
