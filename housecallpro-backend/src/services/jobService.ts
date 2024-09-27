import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HOUSECALL_API_BASE = 'https://api.housecallpro.com';
const API_KEY = process.env.HOUSECALL_API_KEY;

import { Job } from '../models/jobModel';

const api: AxiosInstance = axios.create({
    baseURL: HOUSECALL_API_BASE,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`, // Assuming Bearer Token Authentication
    },
});


export const getJobsByCustomerId = async (customerId: string): Promise<Job[]> => {
    try {
        const response = await api.get(`/jobs`, {
            params: {
                customer_id: customerId,
                page: 1,
                page_size: 100, // Adjust as needed
            },
        });
        return response.data.jobs;
    } catch (error: any) {
        console.error('Error fetching jobs from Housecall Pro API:', error.response?.data || error.message);
        throw new Error('Failed to fetch jobs.');
    }
};