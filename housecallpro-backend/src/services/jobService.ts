// src/services/jobService.ts

import api from '../utils/apiClient';
import { Job, CreateJobPayload } from '../models/jobModel';

/**
 * Retrieves jobs associated with a specific customer ID.
 * 
 * @param customerId - The ID of the customer whose jobs are to be retrieved.
 * @returns A promise that resolves to an array of Job objects.
 */
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

/**
 * Retrieves jobs associated with a specific customer ID.
 * 
 * @param customerId - The ID of the customer whose jobs are to be retrieved.
 * @returns A promise that resolves to an array of Job objects.
 */
export const getAllJobsSvc = async (): Promise<Job[]> => {
    try {
        const response = await api.get(`/jobs`, {
            params: {
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


/**
 * Creates a new job using the Housecall Pro API.
 * 
 * @param jobData - The job data to create.
 * @returns A promise that resolves to the created Job object.
 */
export const createJob = async (jobData: CreateJobPayload): Promise<Job> => {
    try {
        const response = await api.post('/jobs', {
            customer_id: jobData.customer_id,
            schedule: {
                scheduled_start: jobData.scheduled_start,
                scheduled_end: jobData.scheduled_end
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error creating job in Housecall Pro API:', error.response?.data || error.message);
        throw new Error('Failed to create job.');
    }
};
