// src/utils/apiClient.ts

import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HOUSECALL_API_BASE = 'https://api.housecallpro.com';
const API_KEY = process.env.HOUSECALL_API_KEY;

if (!API_KEY) {
    throw new Error('HOUSECALL_API_KEY is not defined in environment variables.');
}

// Create a shared Axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: HOUSECALL_API_BASE,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

export default apiClient;
