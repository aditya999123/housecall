// src/components/CreateJobForm.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CreateJobPayload, Job } from '../types';
import { createJob, getCustomerJobs, getAllJobs } from '../api/customers';
import { generateTimeSlots, filterBookedSlots } from '../utils/timeSlots';

interface CreateJobFormProps {
  onJobCreated: () => void;
}

const CreateJobForm: React.FC<CreateJobFormProps> = ({ onJobCreated }) => {
  const { id } = useParams<{ id: string }>();

  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bookedJobs, setBookedJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (id) {
      // Fetch booked jobs for the customer and set available slots
      const fetchBookedJobs = async () => {
        try {
          // const jobs = await getCustomerJobs(id);
          const jobs = await getAllJobs();
          setBookedJobs(jobs);

          const dayStart = new Date();
          dayStart.setHours(9, 0, 0, 0); // Set to 9:00 AM with zero milliseconds

          const dayEnd = new Date();
          dayEnd.setHours(18, 0, 0, 0); // Set to 6:00 PM with zero milliseconds

          const allSlots = generateTimeSlots(dayStart.toString(), dayEnd.toString());
          const availableSlots = filterBookedSlots(allSlots, jobs);
          setSlots(availableSlots);
        } catch (err: any) {
          console.error('Error fetching jobs:', err);
        }
      };

      fetchBookedJobs();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      setError('Customer ID is missing.');
      return;
    }

    if (!selectedSlot) {
      setError('Please select a time slot.');
      return;
    }

    // Parse the selected time slot
    const [start, end] = selectedSlot.split(' - ');
    const scheduledStart = new Date(`1970-01-01T${start}:00`).toISOString();
    const scheduledEnd = new Date(`1970-01-01T${end}:00`).toISOString();

    const jobPayload: CreateJobPayload = {
      customer_id: id,
      scheduled_start: scheduledStart,
      scheduled_end: scheduledEnd,
      description: ''
    };

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createJob(id, jobPayload);
      setSuccess('Job created successfully!');
      setSelectedSlot('');
      onJobCreated();
    } catch (err: any) {
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
          <label className="block mb-1 font-semibold">Select Time Slot</label>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select a time slot</option>
            {slots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
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
