const AppointmentService = require('../../services/appointmentService');

const appointmentResolvers = {
  Query: {
    appointments: async (parent, { filters }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await AppointmentService.getAppointments(context.user.salonId, filters || {});
    },

    appointment: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await AppointmentService.getAppointmentById(id, context.user.salonId);
    },

    checkAvailability: async (parent, { staffId, startTime, endTime }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await AppointmentService.checkStaffAvailability(
        staffId,
        startTime,
        endTime,
        context.user.salonId
      );
    },

    upcomingAppointments: async (parent, { staffId }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await AppointmentService.getUpcomingAppointments(context.user.salonId, staffId);
    }
  },

  Mutation: {
    createAppointment: async (parent, { input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await AppointmentService.createAppointment(input, context.user.salonId);
    },

    updateAppointment: async (parent, { id, input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await AppointmentService.updateAppointment(id, input, context.user.salonId);
    },

    cancelAppointment: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await AppointmentService.cancelAppointment(id, context.user.salonId);
    },

    completeAppointment: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await AppointmentService.completeAppointment(id, context.user.salonId);
    }
  }
};

module.exports = appointmentResolvers;