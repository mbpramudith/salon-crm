const { gql } = require('apollo-server-express');

const promotionTypes = gql`
  enum PromotionStatus {
    DRAFT
    ACTIVE
    PAUSED
    EXPIRED
  }

  type Promotion {
    id: ID!
    title: String!
    message: String!
    status: PromotionStatus!
    targetAll: Boolean!
    sendSMS: Boolean!
    sendEmail: Boolean!
    scheduledAt: DateTime
    sentAt: DateTime
    createdBy: String!
    salonId: String!
    creator: User!
    salon: Salon!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type PromotionStats {
    total: Int!
    draft: Int!
    active: Int!
    sent: Int!
    paused: Int!
  }

  type PromotionSendResult {
    totalCustomers: Int!
    smsCount: Int!
    emailCount: Int!
    sentAt: DateTime!
  }

  input CreatePromotionInput {
    title: String!
    message: String!
    targetAll: Boolean = false
    sendSMS: Boolean = false
    sendEmail: Boolean = false
    scheduledAt: DateTime
  }

  input UpdatePromotionInput {
    title: String
    message: String
    targetAll: Boolean
    sendSMS: Boolean
    sendEmail: Boolean
    scheduledAt: DateTime
    status: PromotionStatus
  }
`;

module.exports = promotionTypes;