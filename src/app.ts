// src/app.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import usersRouter from './routes/users';
import tripsRouter from './routes/trips';

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', usersRouter);
app.use('/api/trips', tripsRouter);

app.get('/', (req, res) => res.json({ ok: true }));

export default app;
