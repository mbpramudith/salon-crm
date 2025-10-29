const userResolvers = require("./userResolvers");
const customerResolvers = require("./customerResolvers");
const appointmentResolvers = require("./appointmentResolvers");
const serviceResolvers = require("./serviceResolvers");
const paymentResolvers = require("./paymentResolvers");
const promotionResolvers = require("./promotionResolvers");
const reportResolvers = require("./reportResolvers");

const resolvers = {
  Query: {
    // Health check
    health: () => "Salon CRM API is running!",

    // User queries
    ...userResolvers.Query,

    // Customer queries
    ...customerResolvers.Query,

    // Appointment queries
    ...appointmentResolvers.Query,

    // Service queries
    ...serviceResolvers.Query,

    // Payment queries
    ...paymentResolvers.Query,

    // Promotion queries
    ...promotionResolvers.Query,

    // Report queries
    ...reportResolvers.Query,
  },

  Mutation: {
    // User mutations
    ...userResolvers.Mutation,

    // Customer mutations
    ...customerResolvers.Mutation,

    // Appointment mutations
    ...appointmentResolvers.Mutation,

    // Service mutations
    ...serviceResolvers.Mutation,

    // Payment mutations
    ...paymentResolvers.Mutation,

    // Promotion mutations
    ...promotionResolvers.Mutation,
  },
};

module.exports = resolvers;
