// src/app.ts

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// *** CHANGE 1: Import the router under a clear name (driverRoutes) ***
import driverRoutes from './routes/driverRoutes'; 
import dotenv from 'dotenv';
dotenv.config();

// Note: It's assumed that Firebase initialization (importing src/firebase.ts) 
// is handled in server.ts or done globally before this file is executed.


// --- 1. Express Configuration ---
const app: Application = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));

// Logging Middleware
app.use(morgan('dev'));

// Body Parser Middleware
app.use(express.json());

// --- 2. Health Check ---
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Fleet Management API is running.' });
});

// --- 3. Mount Routes ---
// *** CHANGE 2: Mount the router under the correct, clear path /api/drivers ***
app.use('/api/drivers', driverRoutes); 
// If you still have other routes (like users or auth), import and mount them here too.

// --- 4. Global Error Handler ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
});

export default app;