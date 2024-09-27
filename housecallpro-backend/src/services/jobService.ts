// src/services/jobService.ts

import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import { Job, CreateJobPayload } from '../models/jobModel'; // Define CreateJobPayload as per API requirements

dotenv.config();

const HOUSECALL_API_BASE = 'https://api.housecallpro.com';
const API_KEY = process.env.HOUSECALL_API_KEY;


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

// **New Function: Create a Job**
export const createJob = async (jobData: CreateJobPayload): Promise<Job> => {
    try {
        const response = await api.post('/jobs', jobData);
        return response.data;
    } catch (error: any) {
        console.error('Error creating job in Housecall Pro API:', error.response?.data || error.message);
        throw new Error('Failed to create job.');
    }
};
