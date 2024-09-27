import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HOUSECALL_API_BASE = 'https://api.housecallpro.com'; // Update base URL if different
const API_KEY = process.env.HOUSECALL_API_KEY;

// Create an Axios instance with necessary headers for authentication
const api: AxiosInstance = axios.create({
    baseURL: HOUSECALL_API_BASE,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`, // Assuming Bearer Token Authentication
    },
});

// Interface Definitions
interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    // Add other relevant fields as per API response
}

interface JobDetails {
    service: string;
    scheduledTime: string; // ISO 8601 format
    // Add other relevant fields as needed
}

interface Job {
    id: string;
    customerId: string;
    service: string;
    scheduledTime: string;
    // Add other relevant fields as per API response
}

// Find customer by email or phone
export const findCustomerByEmailOrPhone = async (email: string, phone: string): Promise<Customer | null> => {
    try {
        const response = await api.get('/customers', {
            params: {
                // email, // Assuming the API supports filtering by email
                // phone, // Assuming the API supports filtering by phone
                per_page: 50, // Adjust as needed
            },
        });

        console.log(response.data);

        const customers: Customer[] = response.data.customers; // Adjust based on actual response structure

        if (customers.length > 0) {
            // Return the first matching customer
            return customers[0];
        } else {
            return null;
        }
    } catch (error: any) {
        console.error('Error fetching customers:', error.response?.data || error.message);
        throw new Error('Failed to fetch customers.');
    }
};

// Add a new customer
export const addCustomer = async (name: string, email: string, phone: string, address: string): Promise<Customer> => {
    try {
        const payload = {
            name,
            email,
            phone,
            address: {
                line1: address, // Adjust according to API's address structure
                // Add other address fields if required
            },
            // Add other customer fields if necessary
        };

        const response = await api.post('/customers', payload);

        const newCustomer: Customer = response.data.data; // Adjust based on actual response structure

        return newCustomer;
    } catch (error: any) {
        console.error('Error creating customer:', error.response?.data || error.message);
        throw new Error('Failed to create customer.');
    }
};

// Schedule a new job ensuring no overlap
export const scheduleJob = async (customerId: string, jobDetails: JobDetails): Promise<Job> => {
    try {
        // Step 1: Fetch existing jobs for the customer within a relevant timeframe
        const response = await api.get('/jobs', {
            params: {
                customer_id: customerId,
                // Optionally, add date range filters to limit the fetched jobs
                // For example:
                // start_date: '2024-01-01',
                // end_date: '2024-12-31',
                per_page: 100, // Adjust as needed
            },
        });

        const existingJobs: Job[] = response.data.data; // Adjust based on actual response structure

        // Step 2: Check for overlapping jobs
        const newJobStart = new Date(jobDetails.scheduledTime);
        const newJobDuration = 2 * 60 * 60 * 1000; // Assuming 2-hour jobs; adjust as needed
        const newJobEnd = new Date(newJobStart.getTime() + newJobDuration);

        for (const job of existingJobs) {
            const jobStart = new Date(job.scheduledTime);
            const jobDuration = 2 * 60 * 60 * 1000; // Assuming 2-hour jobs; adjust as needed
            const jobEnd = new Date(jobStart.getTime() + jobDuration);

            // Check for overlap
            if (
                (newJobStart >= jobStart && newJobStart < jobEnd) ||
                (newJobEnd > jobStart && newJobEnd <= jobEnd) ||
                (newJobStart <= jobStart && newJobEnd >= jobEnd)
            ) {
                throw new Error(`Job time overlaps with an existing job (Job ID: ${job.id}).`);
            }
        }

        // Step 3: Create the new job
        const jobPayload = {
            customer_id: customerId,
            service: jobDetails.service,
            scheduled_time: jobDetails.scheduledTime, // Ensure ISO 8601 format
            // Add other job fields if necessary
        };

        const jobResponse = await api.post('/jobs', jobPayload);

        const newJob: Job = jobResponse.data.data; // Adjust based on actual response structure

        return newJob;
    } catch (error: any) {
        console.error('Error scheduling job:', error.response?.data || error.message);
        throw new Error(error.message || 'Failed to schedule job.');
    }
};
