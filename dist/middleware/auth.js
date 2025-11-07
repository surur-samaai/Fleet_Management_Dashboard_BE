"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const firebase_1 = require("../firebase");
async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }
    const idToken = authHeader.split(' ')[1];
    try {
        const decoded = await firebase_1.auth.verifyIdToken(idToken);
        req.uid = decoded.uid;
        req.tokenClaims = decoded;
        return next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token', error: String(err) });
    }
}
