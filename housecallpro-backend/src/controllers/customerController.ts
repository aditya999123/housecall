// src/controllers/customerController.ts

import { Request, Response } from 'express';
import { findCustomerByQuery } from '../services/housecallService';

/**
 * Controller to check if a customer exists based on provided information.
 * It searches for customers by name, email, phone, and address independently
 * and merges the results before returning.
 * 
 * @param req - Express Request object containing name, email, phone, and address in the body.
 * @param res - Express Response object to send back the result.
 */
export const checkCustomerExists = async (req: Request, res: Response) => {
    const { name, email, phone, address } = req.body;

    try {
        const customers = await findCustomerByQuery({ name, email, phone, address });

        if (customers.length > 0) {
            res.json({ exists: true, customers });
        } else {
            res.json({ exists: false });
        }
    } catch (error: any) {
        console.error('Error in checkCustomerExists:', error.message);
        res.status(500).json({ error: error.message || 'Failed to check customer existence.' });
    }
};
