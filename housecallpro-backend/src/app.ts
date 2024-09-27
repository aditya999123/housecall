// src/app.ts

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/api';
import jobRoutes from './routes/jobRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions: cors.CorsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Use environment variable for flexibility
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // If you need to send cookies or authentication headers
};

// Apply CORS Middleware
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Apply API Routes
app.use('/api', apiRoutes);
app.use('/api', jobRoutes);

// Health Check Endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('Housecall Pro Backend is running.');
});

// Global Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
