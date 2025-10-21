const { gql } = require('apollo-server-express');

const customerTypes = gql`
  type Customer {
    id: ID!
    name: String!
    phone: String!
    email: String
    address: String
    notes: String
    salonId: String!
    salon: Salon!
    appointments: [Appointment!]!
    payments: [Payment!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateCustomerInput {
    name: String!
    phone: String!
    email: String
    address: String
    notes: String
  }

  input UpdateCustomerInput {
    name: String
    phone: String
    email: String
    address: String
    notes: String
  }
`;

module.exports = customerTypes;