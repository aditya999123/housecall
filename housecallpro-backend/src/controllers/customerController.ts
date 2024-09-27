// src/controllers/customerController.ts

import { Request, Response } from 'express';
import { findCustomerByQuery, findCustomerById, createCustomerSvc } from '../services/housecallService';

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


export const getCustomerById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const customer = await findCustomerById(id);

        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ error: 'Customer not found.' });
        }
    } catch (error: any) {
        console.error('Error in getCustomerById:', error.message);
        res.status(500).json({ error: error.message || 'Failed to retrieve customer.' });
    }
};

export const createCustomerController = async (req: Request, res: Response) => {
    const {
        first_name,
        last_name,
        email,
        mobile_number,
        home_number,
        work_number,
        company,
        notifications_enabled,
        lead_source,
        notes,
        company_name,
        company_id,
        tags,
        addresses,
    } = req.body;

    try {
        const newCustomer = await createCustomerSvc({
            first_name,
            last_name,
            email,
            mobile_number,
            home_number: home_number || null,
            work_number: work_number || null,
            company: company || null,
            notifications_enabled: notifications_enabled || false,
            lead_source: lead_source || null,
            notes: notes || null,
            company_name: company_name || null,
            company_id: company_id || null,
            tags: tags || [],
            addresses: addresses || [],
        });

        res.status(201).json(newCustomer);
    } catch (error: any) {
        console.error('Error in createCustomerController:', error.message);
        res.status(500).json({ error: error.message || 'Failed to create customer.' });
    }
};