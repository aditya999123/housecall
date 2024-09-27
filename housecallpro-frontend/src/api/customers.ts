// src/api/customers.ts

import serverApi from './api';
import { Customer, Job, CreateJobPayload, ApiResponse } from '../types';

/**
 * Fetch customer details by ID.
 */
export const getCustomerDetails = async (id: string): Promise<Customer> => {
  const response = await serverApi.get<Customer>(`/api/customers/${id}`);
  return response.data;
};

/**
 * Fetch jobs associated with a customer.
 */
export const getCustomerJobs = async (id: string): Promise<Job[]> => {
  const response = await serverApi.get<{ jobs: Job[] }>(`/api/customers/${id}/jobs`);
  return response.data.jobs;
};

/**
 * Fetch jobs associated with a customer.
 */
export const getAllJobs = async (): Promise<Job[]> => {
  const response = await serverApi.get<{ jobs: Job[] }>(`/api/jobs`);
  return response.data.jobs;
};


/**
 * Create a new job for a customer.
 */
export const createJob = async (id: string, payload: CreateJobPayload): Promise<void> => {
  await serverApi.post(`/api/customers/${id}/jobs`, payload);
};

/**
 * Check if a customer exists based on provided criteria.
 */
export const checkCustomerExists = async (data: any): Promise<ApiResponse> => {
  const response = await serverApi.post<ApiResponse>('/api/customers/exist', data);
  return response.data;
};

/**
 * Create a new customer.
 */
export const createCustomer = async (data: any): Promise<Customer> => {
  const response = await serverApi.post<Customer>('/api/customers', data);
  return response.data;
};
