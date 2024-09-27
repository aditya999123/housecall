import { Request, Response } from 'express';
import { getJobsByCustomerId } from '../services/jobService';

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