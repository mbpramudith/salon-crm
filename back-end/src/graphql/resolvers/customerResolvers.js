const CustomerService = require('../../services/customerService');

const customerResolvers = {
  Query: {
    customers: async (parent, { search }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await CustomerService.getCustomers(context.user.salonId, search);
    },

    customer: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await CustomerService.getCustomerById(id, context.user.salonId);
    },

    customerServiceHistory: async (parent, { customerId }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await CustomerService.getCustomerServiceHistory(customerId, context.user.salonId);
    }
  },

  Mutation: {
    createCustomer: async (parent, { input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await CustomerService.createCustomer(input, context.user.salonId);
    },

    updateCustomer: async (parent, { id, input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await CustomerService.updateCustomer(id, input, context.user.salonId);
    },

    deleteCustomer: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      await CustomerService.deleteCustomer(id, context.user.salonId);
      return { success: true, message: 'Customer deleted successfully' };
    }
  }
};

module.exports = customerResolvers;