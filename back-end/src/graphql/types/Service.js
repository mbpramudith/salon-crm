const { gql } = require('apollo-server-express');

const serviceTypes = gql`
  type Service {
    id: ID!
    name: String!
    description: String
    duration: Int!
    price: Float!
    isActive: Boolean!
    salonId: String!
    salon: Salon!
    appointments: [Appointment!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateServiceInput {
    name: String!
    description: String
    duration: Int!
    price: Float!
  }

  input UpdateServiceInput {
    name: String
    description: String
    duration: Int
    price: Float
    isActive: Boolean
  }
`;

module.exports = serviceTypes;