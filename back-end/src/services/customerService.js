const Customer = require('../models/Customer');
const Joi = require('joi');

const customerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  email: Joi.string().email().optional(),
  address: Joi.string().max(500).optional(),
  notes: Joi.string().max(1000).optional()
});

class CustomerService {
  static async createCustomer(customerData, salonId) {
    try {
      // Validate input
      const { error, value } = customerSchema.validate(customerData);
      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
      }

      // Check if customer already exists with this phone in the salon
      const existingCustomer = await Customer.findByPhone(value.phone, salonId);
      if (existingCustomer) {
        throw new Error('Customer already exists with this phone number');
      }

      value.salonId = salonId;
      const customer = await Customer.create(value);

      return customer;
    } catch (error) {
      throw new Error(`Customer creation failed: ${error.message}`);
    }
  }

  static async updateCustomer(customerId, customerData, userSalonId) {
    try {
      const existingCustomer = await Customer.findById(customerId);

      if (!existingCustomer) {
        throw new Error('Customer not found');
      }

      // Check salon access
      if (existingCustomer.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      // Validate input
      const { error, value } = customerSchema.validate(customerData);
      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
      }

      // Check if phone number is being changed and if it conflicts
      if (value.phone !== existingCustomer.phone) {
        const phoneConflict = await Customer.findByPhone(value.phone, userSalonId);
        if (phoneConflict && phoneConflict.id !== customerId) {
          throw new Error('Another customer already exists with this phone number');
        }
      }

      const customer = await Customer.update(customerId, value);

      return customer;
    } catch (error) {
      throw new Error(`Customer update failed: ${error.message}`);
    }
  }

  static async deleteCustomer(customerId, userSalonId) {
    try {
      const existingCustomer = await Customer.findById(customerId);

      if (!existingCustomer) {
        throw new Error('Customer not found');
      }

      // Check salon access
      if (existingCustomer.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      await Customer.delete(customerId);

      return { success: true };
    } catch (error) {
      throw new Error(`Customer deletion failed: ${error.message}`);
    }
  }

  static async getCustomers(salonId, searchTerm = null) {
    try {
      const customers = await Customer.findBySalon(salonId, searchTerm);
      return customers;
    } catch (error) {
      throw new Error(`Failed to fetch customers: ${error.message}`);
    }
  }

  static async getCustomerById(customerId, userSalonId) {
    try {
      const customer = await Customer.findById(customerId);

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Check salon access
      if (customer.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      return customer;
    } catch (error) {
      throw new Error(`Failed to fetch customer: ${error.message}`);
    }
  }

  static async searchCustomers(salonId, searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new Error('Search term must be at least 2 characters long');
      }

      const customers = await Customer.findBySalon(salonId, searchTerm.trim());
      return customers;
    } catch (error) {
      throw new Error(`Customer search failed: ${error.message}`);
    }
  }

  static async getCustomerServiceHistory(customerId, userSalonId) {
    try {
      const customer = await Customer.findById(customerId);

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Check salon access
      if (customer.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      const serviceHistory = await Customer.getServiceHistory(customerId);
      return serviceHistory;
    } catch (error) {
      throw new Error(`Failed to fetch service history: ${error.message}`);
    }
  }
}

module.exports = CustomerService;