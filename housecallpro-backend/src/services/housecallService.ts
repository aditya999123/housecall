// src/services/housecallService.ts

import api from '../utils/apiClient';
import { Address, Customer } from '../models/customerModel'; // Adjust the import path as needed

interface CreateCustomerInput {
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    home_number?: string | null;
    work_number?: string | null;
    company?: string | null;
    notifications_enabled: boolean;
    lead_source?: string | null;
    notes?: string | null;
    company_name?: string | null;
    company_id?: string | null;
    tags: any[];
    addresses: Address[];
}

/**
 * Finds customers by searching each provided field independently using the "q" parameter
 * and merges the results to eliminate duplicates.
 * 
 * @param fields - An object containing optional search fields: name, email, phone, address.
 * @returns A promise that resolves to an array of unique Customer objects.
 */
export const findCustomerByQuery = async (fields: { name?: string; email?: string; phone?: string; address?: Address; }): Promise<Customer[]> => {
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
        if (address.street) {
            queries.push(address.street);
        }
        if (address.street_line_2) {
            queries.push(address.street_line_2);
        }
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

/**
 * Finds a customer by their ID.
 * 
 * @param id - The ID of the customer to retrieve.
 * @returns A promise that resolves to the Customer object or null if not found.
 */
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

/**
 * Creates a new customer using the Housecall Pro API.
 * 
 * @param input - The customer data to create.
 * @returns A promise that resolves to the created Customer object.
 */
export const createCustomerSvc = async (input: CreateCustomerInput): Promise<Customer> => {
    try {
        const response = await api.post('/customers', input);
        return response.data;
    } catch (error: any) {
        console.error('Error creating customer via external API:', error.response?.data || error.message);
        throw new Error('Failed to create customer.');
    }
};
