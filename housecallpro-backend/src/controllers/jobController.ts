// src/controllers/jobController.ts

import { Request, Response } from 'express';
import { getJobsByCustomerId, createJob } from '../services/jobService';
import { CreateJobPayload } from '../models/jobModel';

/**
 * Controller to create a job for a specific customer.
 * 
 * @param req - Express Request object containing customer ID in params and job details in body.
 * @param res - Express Response object to send back the created job.
 */
export const createJobForCustomer = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Customer ID from URL
    const jobData: Partial<CreateJobPayload> = req.body; // Job details from request body

    if (!id) {
        res.status(400).json({ error: 'Customer ID is required.' });
        return;
    }

    // Ensure that the jobData includes the customer_id
    jobData.customer_id = id;

    try {
        const newJob = await createJob(jobData as CreateJobPayload);
        res.status(201).json({ job: newJob });
    } catch (error: any) {
        console.error('Error in createJobForCustomer:', error.message);
        res.status(500).json({ error: error.message || 'Failed to create job.' });
    }
};

/**
 * Controller to retrieve all jobs for a specific customer.
 * 
 * @param req - Express Request object containing customer ID in params.
 * @param res - Express Response object to send back the list of jobs.
 */
export const getJobsForCustomer = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Customer ID is required.' });
        return;
    }

    try {
        const jobs = await getJobsByCustomerId(id);
        res.json({ jobs });
    } catch (error: any) {
        console.error('Error in getJobsForCustomer:', error.message);
        res.status(500).json({ error: error.message || 'Failed to fetch jobs.' });
    }
};
