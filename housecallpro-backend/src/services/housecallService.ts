import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HOUSECALL_API_BASE = 'https://api.housecallpro.com/v2';
const API_KEY = process.env.HOUSECALL_API_KEY;
const API_SECRET = process.env.HOUSECALL_API_SECRET;

// Axios instance with authentication
const api = axios.create({
    baseURL: HOUSECALL_API_BASE,
    auth: {
        username: API_KEY || '',
        password: API_SECRET || '',
    },
});

// Find customer by email or phone
export const findCustomerByEmailOrPhone = async (email: string, phone: string) => {
    const response = await api.get('/customers', {
        params: {
            email,
            phone,
        },
    });
    const customers = response.data.data;
    return customers.length > 0 ? customers[0] : null;
};

// Add a new customer
export const addCustomer = async (name: string, email: string, phone: string, address: string) => {
    const response = await api.post('/customers', {
        name,
        email,
        phone,
        address,
    });
    return response.data.data;
};

// Schedule a new job ensuring no overlap
export const scheduleJob = async (customerId: string, jobDetails: any) => {
    // Fetch existing jobs for the customer
    const response = await api.get(`/customers/${customerId}/jobs`);
    const existingJobs = response.data.data;

    // Check for overlapping
    const newJobStart = new Date(jobDetails.scheduledTime);
    const newJobEnd = new Date(newJobStart.getTime() + 2 * 60 * 60 * 1000); // Assuming 2-hour jobs

    for (const job of existingJobs) {
        const jobStart = new Date(job.scheduled_time);
        const jobEnd = new Date(jobStart.getTime() + 2 * 60 * 60 * 1000);
        if (
            (newJobStart >= jobStart && newJobStart < jobEnd) ||
            (newJobEnd > jobStart && newJobEnd <= jobEnd)
        ) {
            throw new Error('Job time overlaps with an existing job.');
        }
    }

    // Create the job
    const jobResponse = await api.post('/jobs', {
        customer_id: customerId,
        service: jobDetails.service,
        scheduled_time: jobDetails.scheduledTime,
    });

    return jobResponse.data.data;
};

