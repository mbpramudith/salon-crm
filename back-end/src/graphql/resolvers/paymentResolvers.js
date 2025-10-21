const PaymentService = require('../../services/paymentService');

const paymentResolvers = {
  Query: {
    payments: async (parent, { filters }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await PaymentService.getPayments(context.user.salonId, filters || {});
    },

    payment: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await PaymentService.getPaymentById(id, context.user.salonId);
    },

    paymentHistory: async (parent, { customerId }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await PaymentService.getPaymentHistory(customerId, context.user.salonId);
    },

    totalEarnings: async (parent, { startDate, endDate }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await PaymentService.getTotalEarnings(context.user.salonId, startDate, endDate);
    },

    staffEarnings: async (parent, { staffId, startDate, endDate }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await PaymentService.getStaffEarnings(staffId, startDate, endDate, context.user.salonId);
    }
  },

  Mutation: {
    createPayment: async (parent, { input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await PaymentService.createPayment(input, context.user.id, context.user.salonId);
    },

    updatePayment: async (parent, { id, input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await PaymentService.updatePayment(id, input, context.user.salonId);
    },

    generateInvoice: async (parent, { appointmentId }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await PaymentService.generateInvoice(appointmentId, context.user.salonId);
    }
  }
};

module.exports = paymentResolvers;