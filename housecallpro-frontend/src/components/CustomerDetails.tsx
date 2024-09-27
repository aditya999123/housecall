// src/components/CustomerDetails.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios, { AxiosInstance } from 'axios';
import { Customer, Job } from '../types';
import CreateJobForm from './CreateJobForm'; // Import the CreateJobForm component

const serverApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // Adjust the base URL as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

const CustomerDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [jobsLoading, setJobsLoading] = useState<boolean>(false);
    const [jobsError, setJobsError] = useState<string | null>(null);

    // Fetch customer details
    const fetchCustomerDetails = async () => {
        if (!id) {
            setError('No customer ID provided.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await serverApi.get<Customer>(`/api/customers/${id}`);
            setCustomer(response.data);
        } catch (err: any) {
            console.error('Error fetching customer details:', err);
            setError('Failed to fetch customer details.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch jobs associated with the customer
    const fetchJobs = async () => {
        if (!id) return;

        setJobsLoading(true);
        setJobsError(null);

        try {
            const response = await serverApi.get<{ jobs: Job[] }>(`/api/customers/${id}/jobs`);
            setJobs(response.data.jobs);
        } catch (err: any) {
            console.error('Error fetching jobs:', err);
            setJobsError('Failed to fetch jobs.');
        } finally {
            setJobsLoading(false);
        }
    };

    // Fetch data on component mount and when 'id' changes
    useEffect(() => {
        fetchCustomerDetails();
        fetchJobs();
    }, [id]);

    // Callback to refresh jobs after creating a new one
    const handleJobCreated = () => {
        fetchJobs();
    };

    if (loading) {
        return <p className="mt-4 text-blue-500">Loading customer details...</p>;
    }

    if (error) {
        return <p className="mt-4 text-red-500">{error}</p>;
    }

    if (!customer) {
        return <p className="mt-4 text-gray-700">No customer data available.</p>;
    }

    return (
        <div className="bg-white p-6 rounded shadow-md">
            <button
                onClick={() => navigate(-1)} // Navigate back to previous page
                className="mb-4 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
                Back
            </button>

            <h2 className="text-2xl mb-4">Customer Details</h2>
            <div className="space-y-2">
                <p>
                    <strong>ID:</strong> {customer.id}
                </p>
                <p>
                    <strong>Name:</strong> {`${customer.first_name} ${customer.last_name}`}
                </p>
                <p>
                    <strong>Email:</strong> {customer.email}
                </p>
                <p>
                    <strong>Mobile Number:</strong> {customer.mobile_number || 'N/A'}
                </p>
                {customer.home_number && (
                    <p>
                        <strong>Home Number:</strong> {customer.home_number}
                    </p>
                )}
                {customer.work_number && (
                    <p>
                        <strong>Work Number:</strong> {customer.work_number}
                    </p>
                )}
                {customer.company_name && (
                    <p>
                        <strong>Company:</strong> {customer.company_name}
                    </p>
                )}
                <p>
                    <strong>Notifications Enabled:</strong> {customer.notifications_enabled ? 'Yes' : 'No'}
                </p>
                <p>
                    <strong>Lead Source:</strong> {customer.lead_source || 'N/A'}
                </p>
                <p>
                    <strong>Notes:</strong> {customer.notes || 'N/A'}
                </p>
                <p>
                    <strong>Created At:</strong> {new Date(customer.created_at).toLocaleString()}
                </p>
                <p>
                    <strong>Updated At:</strong> {new Date(customer.updated_at).toLocaleString()}
                </p>

                {/* Addresses */}
                <div>
                    <strong>Addresses:</strong>
                    {customer.addresses.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {customer.addresses.map((addr, index) => (
                                <li key={index}>
                                    {addr.street}
                                    {addr.street_line_2 && `, ${addr.street_line_2}`},&nbsp;
                                    {addr.city},&nbsp;
                                    {addr.state}&nbsp;
                                    {addr.zip}
                                    {addr.country ? `, ${addr.country}` : ''}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>N/A</p>
                    )}
                </div>
            </div>

            {/* Jobs Section */}
            <div className="mt-6">
                <h3 className="text-xl mb-2">Jobs</h3>
                {jobsLoading && <p className="text-blue-500">Loading jobs...</p>}
                {jobsError && <p className="text-red-500">{jobsError}</p>}
                {!jobsLoading && !jobsError && jobs.length === 0 && (
                    <p className="text-gray-700">No jobs found for this customer.</p>
                )}
                {!jobsLoading && !jobsError && jobs.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">Job ID</th>
                                    <th className="py-2 px-4 border">Invoice #</th>
                                    <th className="py-2 px-4 border">Description</th>
                                    <th className="py-2 px-4 border">Status</th>
                                    <th className="py-2 px-4 border">Scheduled Start</th>
                                    <th className="py-2 px-4 border">Scheduled End</th>
                                    <th className="py-2 px-4 border">Assigned Employees</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => (
                                    <tr key={job.id}>
                                        <td className="py-2 px-4 border">{job.id}</td>
                                        <td className="py-2 px-4 border">{job.invoice_number}</td>
                                        <td className="py-2 px-4 border">{job.description || 'N/A'}</td>
                                        <td className="py-2 px-4 border">{job.work_status}</td>
                                        <td className="py-2 px-4 border">
                                            {job.schedule.scheduled_start
                                                ? new Date(job.schedule.scheduled_start).toLocaleString()
                                                : 'N/A'}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {job.schedule.scheduled_end
                                                ? new Date(job.schedule.scheduled_end).toLocaleString()
                                                : 'N/A'}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {job.assigned_employees.map(emp => `${emp.first_name} ${emp.last_name}`).join(', ') || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Job Form Section */}
            <div className="mt-6">
                <h3 className="text-xl mb-2">Create a New Job</h3>
                <CreateJobForm onJobCreated={handleJobCreated} />
            </div>
        </div>
    );
};

export default CustomerDetails;
