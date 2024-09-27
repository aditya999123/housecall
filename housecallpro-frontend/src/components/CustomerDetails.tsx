// src/components/CustomerDetails.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios, { AxiosInstance } from 'axios';

interface Address {
  street: string;
  street_line_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string | null;
}

interface Customer {
  id: string;
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
  created_at: string;
  updated_at: string;
  company_name?: string | null;
  company_id?: string | null;
  tags: any[];
  addresses: Address[];
}

const serverApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!id) {
        setError('No customer ID provided.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Replace the endpoint with your actual API endpoint to fetch customer by ID
        const response = await serverApi.get<Customer>(`/api/customers/${id}`);
        setCustomer(response.data);
      } catch (err: any) {
        console.error('Error fetching customer details:', err);
        setError('Failed to fetch customer details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]);

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
        {/* Add other fields as needed */}

        {/* Addresses */}
        <div>
          <strong>Addresses:</strong>
          {customer.addresses.length > 0 ? (
            <ul className="list-disc list-inside">
              {customer.addresses.map((addr) => (
                <li>
                  {addr.street}
                  {addr.street_line_2 && `, ${addr.street_line_2}`},&nbsp;
                  {addr.city || 'N/A'},&nbsp;
                  {addr.state || 'N/A'}&nbsp;
                  {addr.zip || 'N/A'}
                  {addr.country ? `, ${addr.country}` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p>N/A</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
