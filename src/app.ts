// src/app.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import usersRouter from './routes/users';
=======

import driverRoutes from './routes/driverRoutes'; 
import assignmentRouter from './routes/assignment'
>>>>>>> Stashed changes
=======

import driverRoutes from './routes/driverRoutes'; 
import assignmentRouter from './routes/assignment'
>>>>>>> Stashed changes

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/api/users', usersRouter);

<<<<<<< Updated upstream
app.get('/', (req, res) => res.json({ ok: true }));
=======
// --- 3. Mount Routes ---
// *** CHANGE 2: Mount the router under the correct, clear path /api/drivers ***
app.use('/api/drivers', driverRoutes); 
<<<<<<< Updated upstream
=======

// Mount the assignment route
app.use('/api/assignment', assignmentRouter);
>>>>>>> Stashed changes

// Mount the assignment route
app.use('/api/assignment', assignmentRouter);
>>>>>>> Stashed changes

export default app;
