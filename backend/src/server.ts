// ==========================
// External Imports
// ==========================

// Express framework for building the server
import express from 'express';

// MongoDB Object Modeling tool for schema-based solutions
import mongoose from 'mongoose';

// Middleware for enabling Cross-Origin Resource Sharing (CORS)
import cors from 'cors';

// Library to manage environment variables
import dotenv from 'dotenv';

// Utilities for file and directory path resolution
import path from 'path';
import { fileURLToPath } from 'url';

// ==========================
// Internal Imports
// ==========================

// Import API routes from the routes folder
import routes from './routes/index.js';

// ==========================
// Application Configuration
// ==========================

// Define the port for the server, with a fallback to 3001
const PORT = process.env.PORT || 3001;

// Initialize the Express application
const app = express();

// Define file and directory paths for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================
// Environment Configuration
// ==========================

// Load environment variables from .env file into process.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ==========================
// Middleware Configuration
// ==========================

// Enable CORS to allow requests from different origins
app.use(cors());

// Parse incoming JSON payloads with a size limit of 10 MB
app.use(express.json({ limit: '10mb' }));

// Parse incoming URL-encoded payloads with extended option enabled
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==========================
// Health Check Endpoint
// ==========================

// Health check endpoint for monitoring and Docker health checks
app.get('/health', (_req, res) => {
    const healthStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    
    // Return 200 if MongoDB is connected, 503 if not
    const statusCode = mongoose.connection.readyState === 1 ? 200 : 503;
    res.status(statusCode).json(healthStatus);
});

// Attach imported routes for handling API endpoints
app.use(routes);

// ==========================
// Database Connection
// ==========================

// Connect to MongoDB database using mongoose
mongoose.connect(process.env.MONGODB_URI || "", {})
    .then(() => console.log('Connected to MongoDB')) // Log success message on connection
    .catch(err => console.error('Failed to connect to MongoDB', err)); // Log error if connection fails

// ==========================
// Static File Handling (Production Mode)
// ==========================

// Serve static files if the environment is set to production
if (process.env.NODE_ENV === 'production') {
    console.log('Production mode: Serving static files.');

    // Serve the built front-end files from the dist folder
    app.use(express.static(path.join(__dirname, '../../web-app/dist')));

    // Serve index.html for any unmatched routes (Single Page Application fallback)
    app.get('*', (_req, res) => {
        res.sendFile(path.join(__dirname, '../../web-app/dist/index.html'));
    });
}

// ==========================
// Server Startup
// ==========================

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`); // Log message indicating successful startup
});
