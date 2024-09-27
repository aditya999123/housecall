import { Request, Response } from 'express';
import { getJobsByCustomerId } from '../services/jobService';

import { createJob } from '../services/jobService';

export const createJobForCustomer = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Customer ID from URL
    const jobData = req.body; // Job details from request body

    if (!id) {
        res.status(400).json({ error: 'Customer ID is required.' });
        return;
    }

    // Ensure that the jobData includes the customer_id
    jobData.customer_id = id;

    try {
        const newJob = await createJob(jobData);
        res.status(201).json({ job: newJob });
    } catch (error: any) {
        console.error('Error in createJobForCustomer:', error.message);
        res.status(500).json({ error: error.message || 'Failed to create job.' });
    }
};

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