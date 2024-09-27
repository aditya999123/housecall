// src/models/customerModel.ts

export interface Address {
    street: string;
    street_line_2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string | null;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: Address;
    // Add other relevant fields as per API response
}
