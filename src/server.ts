// src/server.ts

// Imports the Express application instance you defined in app.ts
import app from './app'; 

// Ensures environment variables (like PORT) are loaded
import dotenv from 'dotenv';
dotenv.config();

// Define the Port: Uses the environment variable PORT or defaults to 3000
const PORT = process.env.PORT || 3000;

// Start the Server: Listens for incoming HTTP requests
app.listen(PORT, () => {
    // This console message confirms the server is running and gives you the URL for testing
    console.log(`🚀 Fleet Management API is running on http://localhost:${PORT}`);
});