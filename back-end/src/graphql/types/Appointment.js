const { gql } = require('apollo-server-express');

const appointmentTypes = gql`
  enum AppointmentStatus {
    SCHEDULED
    CONFIRMED
    IN_PROGRESS
    COMPLETED
    CANCELLED
    NO_SHOW
  }

  type Appointment {
    id: ID!
    customerId: String!
    staffId: String!
    serviceId: String!
    salonId: String!
    date: Date!
    startTime: DateTime!
    endTime: DateTime!
    status: AppointmentStatus!
    notes: String
    reminderSent: Boolean!
    customer: Customer!
    staff: User!
    service: Service!
    salon: Salon!
    payment: Payment
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AvailabilityCheck {
    available: Boolean!
  }

  input AppointmentFilters {
    date: Date
    staffId: ID
    status: AppointmentStatus
  }

  input CreateAppointmentInput {
    customerId: ID!
    staffId: ID!
    serviceId: ID!
    date: Date!
    startTime: DateTime!
    endTime: DateTime!
    notes: String
  }

  input UpdateAppointmentInput {
    customerId: ID
    staffId: ID
    serviceId: ID
    date: Date
    startTime: DateTime
    endTime: DateTime
    status: AppointmentStatus
    notes: String
  }
`;

module.exports = appointmentTypes;