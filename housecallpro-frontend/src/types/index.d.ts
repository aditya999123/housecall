// src/types/index.d.ts

export interface Address {
  street: string;
  street_line_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string | null;
}

export interface CreateJobPayload {
  customer_id: string;
  scheduled_start: string; // ISO 8601 format
  scheduled_end: string; // ISO 8601 format
  description?: string;
  // Add other fields as per your requirements
}

export interface Customer {
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
  company_name?: string | null; // Made optional
  company_id?: string | null;   // Made optional
  tags: any[];
  addresses: Address[];
}

export interface Job {
  id: string;
  invoice_number: string;
  description?: string; // Made optional
  customer: Customer;
  address: Address;
  notes: any[];
  work_status: string;
  work_timestamps: {
    on_my_way_at?: string | null;
    started_at?: string | null;
    completed_at?: string | null;
  };
  schedule: {
    scheduled_start: string;
    scheduled_end: string;
    arrival_window: number;
    appointments: any[];
  };
  total_amount: number;
  outstanding_balance: number;
  assigned_employees: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    color_hex: string;
    avatar_url: string;
    role: string;
    tags: any[];
    permissions: {
      can_add_and_edit_job: boolean;
      can_be_booked_online: boolean;
      can_call_and_text_with_customers: boolean;
      can_chat_with_customers: boolean;
      can_delete_and_cancel_job: boolean;
      can_edit_message_on_invoice: boolean;
      can_see_street_view_data: boolean;
      can_share_job: boolean;
      can_take_payment_see_prices: boolean;
      can_see_customers: boolean;
      can_see_full_schedule: boolean;
      can_see_future_jobs: boolean;
      can_see_marketing_campaigns: boolean;
      can_see_reporting: boolean;
      can_edit_settings: boolean;
      is_point_of_contact: boolean;
      is_admin: boolean;
    };
    company_name: string;
    company_id: string;
  }>;
  tags: any[];
  original_estimate_id?: string | null;
  original_estimate_uuids: string[];
  lead_source?: string | null;
  job_fields: {
    job_type?: string | null;
    business_unit?: string | null;
  };
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  exists: boolean;
  customers: Customer[];
}
