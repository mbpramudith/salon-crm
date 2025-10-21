const Promotion = require('../models/Promotion');
const Customer = require('../models/Customer');
const Joi = require('joi');

const promotionSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  message: Joi.string().min(10).max(1000).required(),
  targetAll: Joi.boolean().default(false),
  sendSMS: Joi.boolean().default(false),
  sendEmail: Joi.boolean().default(false),
  scheduledAt: Joi.date().min('now').optional()
});

class PromotionService {
  static async createPromotion(promotionData, createdBy, salonId) {
    try {
      // Validate input
      const { error, value } = promotionSchema.validate(promotionData);
      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
      }

      if (!value.sendSMS && !value.sendEmail) {
        throw new Error('At least one delivery method (SMS or Email) must be selected');
      }

      value.createdBy = createdBy;
      value.salonId = salonId;
      value.status = 'DRAFT';

      const promotion = await Promotion.create(value);
      
      return promotion;
    } catch (error) {
      throw new Error(`Promotion creation failed: ${error.message}`);
    }
  }

  static async updatePromotion(promotionId, promotionData, userSalonId) {
    try {
      const existingPromotion = await Promotion.findById(promotionId);
      
      if (!existingPromotion) {
        throw new Error('Promotion not found');
      }

      // Check salon access
      if (existingPromotion.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      // Don't allow editing sent promotions
      if (existingPromotion.sentAt) {
        throw new Error('Cannot edit promotions that have already been sent');
      }

      const promotion = await Promotion.update(promotionId, promotionData);
      
      return promotion;
    } catch (error) {
      throw new Error(`Promotion update failed: ${error.message}`);
    }
  }

  static async deletePromotion(promotionId, userSalonId) {
    try {
      const existingPromotion = await Promotion.findById(promotionId);
      
      if (!existingPromotion) {
        throw new Error('Promotion not found');
      }

      // Check salon access
      if (existingPromotion.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      // Don't allow deleting sent promotions
      if (existingPromotion.sentAt) {
        throw new Error('Cannot delete promotions that have already been sent');
      }

      await Promotion.delete(promotionId);
      
      return { success: true };
    } catch (error) {
      throw new Error(`Promotion deletion failed: ${error.message}`);
    }
  }

  static async getPromotions(salonId, status = null) {
    try {
      const promotions = await Promotion.findBySalon(salonId, status);
      return promotions;
    } catch (error) {
      throw new Error(`Failed to fetch promotions: ${error.message}`);
    }
  }

  static async getPromotionById(promotionId, userSalonId) {
    try {
      const promotion = await Promotion.findById(promotionId);
      
      if (!promotion) {
        throw new Error('Promotion not found');
      }

      // Check salon access
      if (promotion.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      return promotion;
    } catch (error) {
      throw new Error(`Failed to fetch promotion: ${error.message}`);
    }
  }

  static async activatePromotion(promotionId, userSalonId) {
    try {
      const existingPromotion = await Promotion.findById(promotionId);
      
      if (!existingPromotion) {
        throw new Error('Promotion not found');
      }

      // Check salon access
      if (existingPromotion.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      if (existingPromotion.status !== 'DRAFT') {
        throw new Error('Only draft promotions can be activated');
      }

      const promotion = await Promotion.update(promotionId, { 
        status: 'ACTIVE',
        scheduledAt: existingPromotion.scheduledAt || new Date()
      });
      
      return promotion;
    } catch (error) {
      throw new Error(`Promotion activation failed: ${error.message}`);
    }
  }

  static async sendPromotion(promotionId, userSalonId) {
    try {
      const promotion = await Promotion.findById(promotionId);
      
      if (!promotion) {
        throw new Error('Promotion not found');
      }

      // Check salon access
      if (promotion.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      if (promotion.status !== 'ACTIVE') {
        throw new Error('Only active promotions can be sent');
      }

      if (promotion.sentAt) {
        throw new Error('Promotion has already been sent');
      }

      // Get target customers
      const customers = await Customer.findBySalon(userSalonId);
      
      if (customers.length === 0) {
        throw new Error('No customers found to send promotion to');
      }

      // Here you would integrate with SMS/Email services
      // For now, we'll simulate the sending process
      const results = {
        totalCustomers: customers.length,
        smsCount: promotion.sendSMS ? customers.filter(c => c.phone).length : 0,
        emailCount: promotion.sendEmail ? customers.filter(c => c.email).length : 0,
        sentAt: new Date()
      };

      // Mark promotion as sent
      await Promotion.markAsSent(promotionId);

      return results;
    } catch (error) {
      throw new Error(`Promotion sending failed: ${error.message}`);
    }
  }

  static async pausePromotion(promotionId, userSalonId) {
    try {
      const existingPromotion = await Promotion.findById(promotionId);
      
      if (!existingPromotion) {
        throw new Error('Promotion not found');
      }

      // Check salon access
      if (existingPromotion.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      if (existingPromotion.status !== 'ACTIVE') {
        throw new Error('Only active promotions can be paused');
      }

      const promotion = await Promotion.update(promotionId, { 
        status: 'PAUSED' 
      });
      
      return promotion;
    } catch (error) {
      throw new Error(`Promotion pause failed: ${error.message}`);
    }
  }

  static async getPromotionStats(salonId) {
    try {
      const promotions = await Promotion.findBySalon(salonId);
      
      const stats = {
        total: promotions.length,
        draft: promotions.filter(p => p.status === 'DRAFT').length,
        active: promotions.filter(p => p.status === 'ACTIVE').length,
        sent: promotions.filter(p => p.sentAt).length,
        paused: promotions.filter(p => p.status === 'PAUSED').length
      };

      return stats;
    } catch (error) {
      throw new Error(`Failed to fetch promotion stats: ${error.message}`);
    }
  }
}

module.exports = PromotionService;