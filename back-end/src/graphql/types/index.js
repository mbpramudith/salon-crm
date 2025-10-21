const { gql } = require('apollo-server-express');
const userTypes = require('./User');
const customerTypes = require('./Customer');
const appointmentTypes = require('./Appointment');
const serviceTypes = require('./Service');
const paymentTypes = require('./Payment');
const promotionTypes = require('./Promotion');
const reportTypes = require('./Report');

const rootTypes = gql`
  scalar Date
  scalar DateTime

  type Query {
    # Health check
    health: String!
    
    # User queries
    me: User!
    users(role: UserRole): [User!]!
    user(id: ID!): User
    
    # Customer queries
    customers(search: String): [Customer!]!
    customer(id: ID!): Customer
    customerServiceHistory(customerId: ID!): [Appointment!]!
    
    # Appointment queries
    appointments(filters: AppointmentFilters): [Appointment!]!
    appointment(id: ID!): Appointment
    checkAvailability(staffId: ID!, startTime: DateTime!, endTime: DateTime!): AvailabilityCheck!
    upcomingAppointments(staffId: ID): [Appointment!]!
    
    # Service queries
    services(activeOnly: Boolean = true): [Service!]!
    service(id: ID!): Service
    popularServices(limit: Int = 10): [Service!]!
    
    # Payment queries
    payments(filters: PaymentFilters): [Payment!]!
    payment(id: ID!): Payment
    paymentHistory(customerId: ID!): [Payment!]!
    totalEarnings(startDate: Date!, endDate: Date!): EarningsReport!
    staffEarnings(staffId: ID!, startDate: Date!, endDate: Date!): EarningsReport!
    
    # Promotion queries
    promotions(status: PromotionStatus): [Promotion!]!
    promotion(id: ID!): Promotion
    promotionStats: PromotionStats!
    
    # Report queries
    jobReport(startDate: Date!, endDate: Date!, staffId: ID): JobReport!
    financialReport(startDate: Date!, endDate: Date!, staffId: ID): FinancialReport!
    staffReport(startDate: Date!, endDate: Date!, staffId: ID): StaffReport!
    dashboardStats: DashboardStats!
  }

  type Mutation {
    # Auth mutations
    login(email: String!, password: String!): AuthPayload!
    register(input: RegisterInput!): AuthPayload!
    changePassword(currentPassword: String!, newPassword: String!): SuccessResponse!
    generateApiKey: ApiKeyResponse!
    
    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): SuccessResponse!
    
    # Customer mutations
    createCustomer(input: CreateCustomerInput!): Customer!
    updateCustomer(id: ID!, input: UpdateCustomerInput!): Customer!
    deleteCustomer(id: ID!): SuccessResponse!
    
    # Appointment mutations
    createAppointment(input: CreateAppointmentInput!): Appointment!
    updateAppointment(id: ID!, input: UpdateAppointmentInput!): Appointment!
    cancelAppointment(id: ID!): Appointment!
    completeAppointment(id: ID!): Appointment!
    
    # Service mutations
    createService(input: CreateServiceInput!): Service!
    updateService(id: ID!, input: UpdateServiceInput!): Service!
    deleteService(id: ID!): SuccessResponse!
    
    # Payment mutations
    createPayment(input: CreatePaymentInput!): Payment!
    updatePayment(id: ID!, input: UpdatePaymentInput!): Payment!
    generateInvoice(appointmentId: ID!): Payment!
    
    # Promotion mutations
    createPromotion(input: CreatePromotionInput!): Promotion!
    updatePromotion(id: ID!, input: UpdatePromotionInput!): Promotion!
    deletePromotion(id: ID!): SuccessResponse!
    activatePromotion(id: ID!): Promotion!
    sendPromotion(id: ID!): PromotionSendResult!
    pausePromotion(id: ID!): Promotion!
  }

  type SuccessResponse {
    success: Boolean!
    message: String
  }
`;

const typeDefs = [
  rootTypes,
  userTypes,
  customerTypes,
  appointmentTypes,
  serviceTypes,
  paymentTypes,
  promotionTypes,
  reportTypes
];

module.exports = typeDefs;