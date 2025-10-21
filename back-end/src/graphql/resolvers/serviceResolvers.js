const Service = require('../../models/Service');

const serviceResolvers = {
  Query: {
    services: async (parent, { activeOnly = true }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await Service.findBySalon(context.user.salonId, activeOnly);
    },

    service: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const service = await Service.findById(id);
      
      if (!service) {
        throw new Error('Service not found');
      }

      // Check salon access
      if (service.salonId !== context.user.salonId) {
        throw new Error('Access denied');
      }

      return service;
    },

    popularServices: async (parent, { limit = 10 }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await Service.findPopularServices(context.user.salonId, limit);
    }
  },

  Mutation: {
    createService: async (parent, { input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      if (context.user.role === 'STAFF') {
        throw new Error('Staff members cannot create services');
      }

      input.salonId = context.user.salonId;
      return await Service.create(input);
    },

    updateService: async (parent, { id, input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (context.user.role === 'STAFF') {
        throw new Error('Staff members cannot update services');
      }

      const existingService = await Service.findById(id);
      
      if (!existingService) {
        throw new Error('Service not found');
      }

      // Check salon access
      if (existingService.salonId !== context.user.salonId) {
        throw new Error('Access denied');
      }

      return await Service.update(id, input);
    },

    deleteService: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (context.user.role === 'STAFF') {
        throw new Error('Staff members cannot delete services');
      }

      const existingService = await Service.findById(id);
      
      if (!existingService) {
        throw new Error('Service not found');
      }

      // Check salon access
      if (existingService.salonId !== context.user.salonId) {
        throw new Error('Access denied');
      }

      await Service.delete(id);
      return { success: true, message: 'Service deleted successfully' };
    }
  }
};

module.exports = serviceResolvers;