const { gql } = require('apollo-server-express');

const paymentTypes = gql`
  enum PaymentMethod {
    CASH
    CARD
    DIGITAL_WALLET
    BANK_TRANSFER
  }

  enum PaymentStatus {
    PENDING
    COMPLETED
    FAILED
    REFUNDED
  }

  type Payment {
    id: ID!
    appointmentId: String
    customerId: String!
    staffId: String!
    salonId: String!
    amount: Float!
    method: PaymentMethod!
    status: PaymentStatus!
    transactionId: String
    notes: String
    appointment: Appointment
    customer: Customer!
    staff: User!
    salon: Salon!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type EarningsReport {
    totalEarnings: Float!
    staffEarnings: Float
  }

  input PaymentFilters {
    startDate: Date
    endDate: Date
    status: PaymentStatus
    staffId: ID
  }

  input CreatePaymentInput {
    appointmentId: ID
    customerId: ID!
    amount: Float!
    method: PaymentMethod!
    transactionId: String
    notes: String
  }

  input UpdatePaymentInput {
    amount: Float
    method: PaymentMethod
    status: PaymentStatus
    transactionId: String
    notes: String
  }
`;

module.exports = paymentTypes;