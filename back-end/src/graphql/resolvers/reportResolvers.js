const ReportService = require('../../services/reportService');

const reportResolvers = {
  Query: {
    jobReport: async (parent, { startDate, endDate, staffId }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      if (context.user.role === 'STAFF' && staffId && staffId !== context.user.id) {
        throw new Error('Staff members can only view their own reports');
      }

      return await ReportService.getJobReport(
        context.user.salonId,
        startDate,
        endDate,
        staffId
      );
    },

    financialReport: async (parent, { startDate, endDate, staffId }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      if (context.user.role === 'STAFF') {
        throw new Error('Staff members cannot view financial reports');
      }

      return await ReportService.getFinancialReport(
        context.user.salonId,
        startDate,
        endDate,
        staffId
      );
    },

    staffReport: async (parent, { startDate, endDate, staffId }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      if (context.user.role === 'STAFF' && staffId && staffId !== context.user.id) {
        throw new Error('Staff members can only view their own reports');
      }

      return await ReportService.getStaffReport(
        context.user.salonId,
        startDate,
        endDate,
        staffId
      );
    },

    dashboardStats: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      return await ReportService.getDashboardStats(context.user.salonId);
    }
  }
};

module.exports = reportResolvers;