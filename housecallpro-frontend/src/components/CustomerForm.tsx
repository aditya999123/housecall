import React, { useState } from 'react';
import axios from 'axios';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CustomerForm: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  const [isExisting, setIsExisting] = useState<boolean | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [jobService, setJobService] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleCheckCustomer = async () => {
    try {
      const response = await axios.post('/api/customers/exist', { email, phone });
      if (response.data.exists) {
        setIsExisting(true);
        setCustomer(response.data.customer);
      } else {
        setIsExisting(false);
        setCustomer(null);
      }
    } catch (error) {
      console.error('Error checking customer:', error);
    }
  };

  const handleCreateCustomer = async () => {
    try {
      const response = await axios.post('/api/customers', { name, email, phone, address });
      setCustomer(response.data.customer);
      setIsExisting(true);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleCreateJob = async () => {
    if (!customer) {
      alert('Customer must exist to create a job.');
      return;
    }
    try {
      const response = await axios.post('/api/jobs', {
        customerId: customer.id,
        jobDetails: {
          service: jobService,
          scheduledTime,
        },
      });
      alert('Job created successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error creating job.');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
      <h2 className="text-2xl mb-4">Customer Support Tool</h2>
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Phone Number</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      {!isExisting && (
        <div className="mb-4">
          <label className="block mb-1">Address</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}

          />
        </div>
      )}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4"
        onClick={handleCheckCustomer}
      >
        {isExisting !== null ? 'Re-check Customer' : 'Check Customer'}
      </button>

      {isExisting === false && (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded w-full mb-4"
          onClick={handleCreateCustomer}
        >
          Create New Customer
        </button>
      )}

      {isExisting && (
        <>
          <div className="mb-4">
            <label className="block mb-1">Service</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={jobService}
              onChange={(e) => setJobService(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Scheduled Time</label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded w-full"
            onClick={handleCreateJob}
          >
            Create Job
          </button>
        </>
      )}
    </div>
  );
};

export default CustomerForm;

