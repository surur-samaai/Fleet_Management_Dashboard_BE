// src/server.ts
import app from './app';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
