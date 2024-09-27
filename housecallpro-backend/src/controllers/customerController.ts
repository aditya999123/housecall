import { Request, Response } from 'express';
import { 
    findCustomerByEmailOrPhone, 
    addCustomer, 
    scheduleJob 
} from '../services/housecallService';

export const checkCustomerExists = async (req: Request, res: Response) => {
    const { email, phone } = req.body;
    try {
        const customer = await findCustomerByEmailOrPhone(email, phone);
        if (customer) {
            res.json({ exists: true, customer });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to check customer existence.' });
    }
};

export const createCustomer = async (req: Request, res: Response) => {
    const { name, email, phone, address } = req.body;
    try {
        const newCustomer = await addCustomer(name, email, phone, address);
        res.json({ success: true, customer: newCustomer });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create customer.' });
    }
};

export const createJob = async (req: Request, res: Response) => {
    const { customerId, jobDetails } = req.body;
    try {
        const job = await scheduleJob(customerId, jobDetails);
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create job.' });
    }
};

