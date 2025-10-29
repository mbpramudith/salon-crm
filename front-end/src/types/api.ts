// front-end/src/types/api.ts

// Customer types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
}

// Appointment types
export interface Appointment {
  id: string;
  date: string;
  customerId: string;
  serviceId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
}

export interface AppointmentInput {
  date: string;
  customerId: string;
  serviceId: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
}

// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

// GraphQL response types
export interface CustomersResponse {
  customers: Customer[];
}

export interface CreateAppointmentResponse {
  createAppointment: Appointment;
}