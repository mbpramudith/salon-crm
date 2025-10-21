const { gql } = require('apollo-server-express');

const userTypes = gql`
  enum UserRole {
    SUPER_ADMIN
    OWNER
    STAFF
  }

  type User {
    id: ID!
    email: String!
    phone: String
    name: String!
    role: UserRole!
    isActive: Boolean!
    apiKey: String
    salonId: String
    salon: Salon
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Salon {
    id: ID!
    name: String!
    address: String!
    phone: String!
    email: String
    description: String
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type ApiKeyResponse {
    apiKey: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String!
    role: UserRole!
    phone: String
    salonId: String
  }

  input CreateUserInput {
    email: String!
    password: String!
    name: String!
    role: UserRole!
    phone: String
    salonId: String
  }

  input UpdateUserInput {
    email: String
    name: String
    phone: String
    isActive: Boolean
  }
`;

module.exports = userTypes;