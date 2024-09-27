// src/services/housecallService.ts

import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HOUSECALL_API_BASE = 'https://api.housecallpro.com';
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
interface Address {
    line1: string;
    line2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: Address;
    // Add other relevant fields as per API response
}

interface JobDetails {
    service: string;
    scheduledTime: string; // ISO 8601 format
    // Add other relevant fields as needed
}

interface Job {
    id: string;
    customer_id: string;
    service: string;
    scheduled_time: string;
    // Add other relevant fields as per API response
}

/**
 * Finds customers by searching each provided field independently using the "q" parameter
 * and merges the results to eliminate duplicates.
 * 
 * @param fields - An object containing optional search fields: name, email, phone, address.
 * @returns A promise that resolves to an array of unique Customer objects.
 */
export const findCustomerByQuery = async (fields: { name?: string; email?: string; phone?: string; address?: string; }): Promise<Customer[]> => {
    const { name, email, phone, address } = fields;

    const queries: string[] = [];

    if (name) {
        queries.push(name);
    }
    if (email) {
        queries.push(email);
    }
    if (phone) {
        queries.push(phone);
    }
    if (address) {
        queries.push(address);
    }

    if (queries.length === 0) {
        return [];
    }

    // Perform searches in parallel for each query
    const searchPromises = queries.map(async (q) => {
        try {
            console.log('q=', q);
            const response = await api.get('/customers', {
                params: {
                    q, // Comprehensive search across multiple fields
                    per_page: 50, // Adjust as needed
                },
            });

            const customers: Customer[] = response.data.customers; // Accessing customers from response.data.customers
            return customers;
        } catch (error: any) {
            console.error(`Error searching with q="${q}":`, error.response?.data || error.message);
            return [];
        }
    });

    // Wait for all search promises to resolve
    const results = await Promise.all(searchPromises);

    // Flatten the array of arrays into a single array
    const allCustomers = results.flat();

    // Deduplicate customers by their unique ID
    const uniqueCustomersMap = new Map<string, Customer>();
    allCustomers.forEach((customer) => {
        if (!uniqueCustomersMap.has(customer.id)) {
            uniqueCustomersMap.set(customer.id, customer);
        }
    });

    return Array.from(uniqueCustomersMap.values());
};


export const findCustomerById = async (id: string): Promise<Customer | null> => {
    try {
        const response = await api.get(`/customers/${id}`);
        const customer: Customer = response.data;
        return customer;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            // Customer not found
            return null;
        }
        console.error(`Error fetching customer with ID "${id}":`, error.response?.data || error.message);
        throw new Error('Failed to retrieve customer.');
    }
};
