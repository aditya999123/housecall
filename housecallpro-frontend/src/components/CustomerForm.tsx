// src/components/CustomerForm.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosInstance } from 'axios';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';

interface Address {
  id: string;
  type: string;
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

interface ApiResponse {
  exists: boolean;
  customers: Customer[];
}

const serverApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

const CustomerForm: React.FC = () => {
  const navigate = useNavigate();

  // State variables for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // State variables for API responses and status
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Debounced function to fetch customers based on input fields.
   * This prevents excessive API calls by waiting for the user to stop typing.
   */
  const fetchCustomers = useCallback(
    debounce(async (name: string, email: string, phone: string, address: string) => {
      // Construct the search query by combining all non-empty fields
      const queryParts: string[] = [];
      if (name) queryParts.push(name);
      if (email) queryParts.push(email);
      if (phone) queryParts.push(phone);
      if (address) queryParts.push(address);
      const query = queryParts.join(' ');

      // If no fields are filled, clear the customers list and return
      if (queryParts.length === 0) {
        setCustomers([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Make API call to check if customer exists
        const response = await serverApi.post<ApiResponse>('/api/customers/exist', {
          name,
          email,
          phone,
          address,
        });

        const data = response.data;

        if (data.exists && data.customers.length > 0) {
          setCustomers(data.customers);
        } else {
          setCustomers([]);
        }
      } catch (err: any) {
        console.error('Error fetching customers:', err);
        setError('Failed to fetch customers.');
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms debounce delay
    []
  );

  /**
   * useEffect hook to trigger the debounced fetchCustomers function
   * whenever any of the form fields change.
   */
  useEffect(() => {
    fetchCustomers(name, email, phone, address);

    // Cleanup function to cancel the debounce on unmount
    return () => {
      fetchCustomers.cancel();
    };
  }, [name, email, phone, address, fetchCustomers]);

  /**
   * Helper function to combine first and last names
   */
  const getFullName = (customer: Customer): string => {
    return `${customer.first_name} ${customer.last_name}`;
  };

  /**
   * Helper function to format address
   */
  const formatAddress = (addresses: Address[]): string => {
    if (addresses.length === 0) return 'N/A';
    const addr = addresses[0]; // Assuming the first address is primary
    const parts = [addr.street];
    if (addr.street_line_2) parts.push(addr.street_line_2);
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.zip) parts.push(addr.zip);
    if (addr.country) parts.push(addr.country);
    return parts.join(', ');
  };

  /**
   * Handler for creating a new customer
   */
  const handleCreateCustomer = async () => {
    // Placeholder function: Implement the logic to create a new customer
    alert('Create Customer functionality is not implemented yet.');
  };

  /**
   * Handler for selecting a customer
   */
  const handleSelectCustomer = (customer: Customer) => {
    navigate(`/customers/${customer.id}`);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl mb-4">Customer Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter customer email"
          />
        </div>

        {/* Phone Number Field */}
        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter customer phone number"
          />
        </div>

        {/* Address Field */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter customer address"
          />
        </div>
      </div>

      {/* Create Customer Button */}
      <div className="mt-4">
        <button
          onClick={handleCreateCustomer}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Customer
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <p className="mt-4 text-blue-500">Loading...</p>}

      {/* Error Message */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Customers Table */}
      {customers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl mb-2">Existing Customers</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Mobile Number</th>
                  <th className="py-2 px-4 border">Address</th>
                  <th className="py-2 px-4 border">Actions</th> {/* New Actions Column */}
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="py-2 px-4 border">{customer.id}</td>
                    <td className="py-2 px-4 border">{getFullName(customer)}</td>
                    <td className="py-2 px-4 border">{customer.email}</td>
                    <td className="py-2 px-4 border">
                      {customer.mobile_number || 'N/A'}
                    </td>
                    <td className="py-2 px-4 border">
                      {formatAddress(customer.addresses)}
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleSelectCustomer(customer)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Select Customer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Customers Found Message */}
      {!loading && !error && customers.length === 0 && (name || email || phone || address) && (
        <div className="mt-6">
          <p className="text-gray-700">No existing customers found with the provided information.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerForm;
