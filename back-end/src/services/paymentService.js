const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const Joi = require('joi');

const paymentSchema = Joi.object({
  appointmentId: Joi.string().uuid().optional(),
  customerId: Joi.string().uuid().required(),
  amount: Joi.number().positive().precision(2).required(),
  method: Joi.string().valid('CASH', 'CARD', 'DIGITAL_WALLET', 'BANK_TRANSFER').required(),
  transactionId: Joi.string().optional(),
  notes: Joi.string().max(500).optional()
});

class PaymentService {
  static async createPayment(paymentData, staffId, salonId) {
    try {
      // Validate input
      const { error, value } = paymentSchema.validate(paymentData);
      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
      }

      // Verify customer belongs to salon
      const customer = await Customer.findById(value.customerId);
      if (!customer || customer.salonId !== salonId) {
        throw new Error('Customer not found or does not belong to this salon');
      }

      // If appointment is specified, verify it belongs to salon and customer
      if (value.appointmentId) {
        const appointment = await Appointment.findById(value.appointmentId);
        if (!appointment || appointment.salonId !== salonId || appointment.customerId !== value.customerId) {
          throw new Error('Appointment not found or does not match customer/salon');
        }

        // Check if payment already exists for this appointment
        if (appointment.payment) {
          throw new Error('Payment already exists for this appointment');
        }
      }

      value.staffId = staffId;
      value.salonId = salonId;
      value.status = 'COMPLETED'; // Default to completed for recorded payments

      const payment = await Payment.create(value);
      
      return payment;
    } catch (error) {
      throw new Error(`Payment creation failed: ${error.message}`);
    }
  }

  static async updatePayment(paymentId, paymentData, userSalonId) {
    try {
      const existingPayment = await Payment.findById(paymentId);
      
      if (!existingPayment) {
        throw new Error('Payment not found');
      }

      // Check salon access
      if (existingPayment.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      const payment = await Payment.update(paymentId, paymentData);
      
      return payment;
    } catch (error) {
      throw new Error(`Payment update failed: ${error.message}`);
    }
  }

  static async getPayments(salonId, filters = {}) {
    try {
      const payments = await Payment.findBySalon(salonId, filters);
      return payments;
    } catch (error) {
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }
  }

  static async getPaymentById(paymentId, userSalonId) {
    try {
      const payment = await Payment.findById(paymentId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }

      // Check salon access
      if (payment.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      return payment;
    } catch (error) {
      throw new Error(`Failed to fetch payment: ${error.message}`);
    }
  }

  static async generateInvoice(appointmentId, userSalonId) {
    try {
      const appointment = await Appointment.findById(appointmentId);
      
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Check salon access
      if (appointment.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      if (appointment.status !== 'COMPLETED') {
        throw new Error('Can only generate invoice for completed appointments');
      }

      // Check if payment already exists
      if (appointment.payment) {
        return appointment.payment;
      }

      // Create invoice data
      const invoiceData = {
        appointmentId: appointment.id,
        customerId: appointment.customerId,
        amount: appointment.service.price,
        method: 'CASH', // Default method
        status: 'PENDING',
        notes: `Invoice for ${appointment.service.name} service`
      };

      const payment = await this.createPayment(invoiceData, appointment.staffId, userSalonId);
      
      return payment;
    } catch (error) {
      throw new Error(`Invoice generation failed: ${error.message}`);
    }
  }

  static async getPaymentHistory(customerId, userSalonId) {
    try {
      const customer = await Customer.findById(customerId);
      
      if (!customer) {
        throw new Error('Customer not found');
      }

      // Check salon access
      if (customer.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      const payments = await Payment.findBySalon(userSalonId, { customerId });
      return payments;
    } catch (error) {
      throw new Error(`Failed to fetch payment history: ${error.message}`);
    }
  }

  static async getTotalEarnings(salonId, startDate, endDate) {
    try {
      const totalEarnings = await Payment.getTotalEarnings(salonId, startDate, endDate);
      return { totalEarnings };
    } catch (error) {
      throw new Error(`Failed to calculate total earnings: ${error.message}`);
    }
  }

  static async getStaffEarnings(staffId, startDate, endDate, userSalonId) {
    try {
      const staffEarnings = await Payment.getStaffEarnings(staffId, startDate, endDate);
      return { staffEarnings };
    } catch (error) {
      throw new Error(`Failed to calculate staff earnings: ${error.message}`);
    }
  }
}

module.exports = PaymentService;