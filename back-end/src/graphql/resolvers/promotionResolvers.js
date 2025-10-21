const PromotionService = require('../../services/promotionService');

const promotionResolvers = {
  Query: {
    promotions: async (parent, { status }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      if (context.user.role === 'STAFF') {
        throw new Error('Staff members cannot view promotions');
      }

      return await PromotionService.getPromotions(context.user.salonId, status);
    },

    promotion: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      if (context.user.role === 'STAFF') {
        throw new Error('Staff members cannot view promotions');
      }

      return await PromotionService.getPromotionById(id, context.user.salonId);
    },

    promotionStats: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      if (context.user.role === 'STAFF') {
        throw new Error('Staff members cannot view promotion stats');
      }

      return await PromotionService.getPromotionStats(context.user.salonId);
    }
  },

  Mutation: {
    createPromotion: async (parent, { input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      if (context.user.role === 'STAFF') {
        throw new Error('Staff members cannot create promotions');
      }

      return await PromotionService.createPromotion(input, context.user.id, context.user.salonId);
    },

    updatePromotion: async (parent, { id, input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      if (context.user.role === 'STAFF') {
        throw new Error('Staff members cannot update promotions');
      }

      return await PromotionService.updatePromotion(id, input, context.user.salonId);
    },

    deletePromotion: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      if (context.user.role === 'STAFF') {
        throw new Error('Staff members cannot delete promotions');
      }

      await PromotionService.deletePromotion(id, context.user.salonId);
      return { success: true, message: 'Promotion deleted successfully' };
    },

    activatePromotion: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      if (context.user.role === 'STAFF') {
        throw new Error('Staff members cannot activate promotions');
      }

      return await PromotionService.activatePromotion(id, context.user.salonId);
    },

    sendPromotion: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      if (context.user.role === 'STAFF') {
        throw new Error('Staff members cannot send promotions');
      }

      return await PromotionService.sendPromotion(id, context.user.salonId);
    },

    pausePromotion: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      if (!context.user.salonId) {
        throw new Error('User must belong to a salon');
      }

      if (context.user.role === 'STAFF') {
        throw new Error('Staff members cannot pause promotions');
      }

      return await PromotionService.pausePromotion(id, context.user.salonId);
    }
  }
};

module.exports = promotionResolvers;