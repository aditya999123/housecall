// src/components/CreateJobForm.tsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosInstance } from 'axios';
import { CreateJobPayload } from '../types'; // Ensure this type is defined in your types file

interface CreateJobFormProps {
    onJobCreated: () => void;
}

const serverApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // Adjust the base URL as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

const CreateJobForm: React.FC<CreateJobFormProps> = ({ onJobCreated }) => {
    const { id } = useParams<{ id: string }>();

    const [serviceCategory, setServiceCategory] = useState<string>('');
    const [serviceType, setServiceType] = useState<string>('');
    const [scheduledStart, setScheduledStart] = useState<string>('');
    const [scheduledEnd, setScheduledEnd] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) {
            setError('Customer ID is missing.');
            return;
        }

        // Convert scheduledStart and scheduledEnd to ISO 8601 format
        const isoScheduledStart = new Date(scheduledStart).toISOString();
        const isoScheduledEnd = new Date(scheduledEnd).toISOString();

        const jobPayload: CreateJobPayload = {
            customer_id: id,
            service_category: serviceCategory,
            service_type: serviceType,
            scheduled_start: isoScheduledStart,
            scheduled_end: isoScheduledEnd,
            description: description || undefined,
            // Add other fields as required by the API
        };

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await serverApi.post(`/api/customers/${id}/jobs`, jobPayload);
            setSuccess('Job created successfully!');
            // Clear form fields
            setServiceCategory('');
            setServiceType('');
            setScheduledStart('');
            setScheduledEnd('');
            setDescription('');
            // Notify parent component to refresh jobs list
            onJobCreated();
        } catch (err: any) {
            console.error('Error creating job:', err.response?.data || err.message);
            setError(err.response?.data?.error || 'Failed to create job.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 p-4 rounded">
            <h4 className="text-lg mb-2">Create a New Job</h4>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-500 mb-2">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold">Service Category</label>
                    <input
                        type="text"
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                        placeholder="e.g., Plumbing, Electrical"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Service Type</label>
                    <input
                        type="text"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                        placeholder="e.g., Leak Fix, Wiring Installation"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Scheduled Start</label>
                    <input
                        type="datetime-local"
                        value={scheduledStart}
                        onChange={(e) => setScheduledStart(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Scheduled End</label>
                    <input
                        type="datetime-local"
                        value={scheduledEnd}
                        onChange={(e) => setScheduledEnd(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Optional job description..."
                    ></textarea>
                </div>
                {/* Add more fields as necessary */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {loading ? 'Creating...' : 'Create Job'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateJobForm;
