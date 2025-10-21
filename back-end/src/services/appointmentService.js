const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const Service = require('../models/Service');
const User = require('../models/User');
const Joi = require('joi');

const appointmentSchema = Joi.object({
  customerId: Joi.string().uuid().required(),
  staffId: Joi.string().uuid().required(),
  serviceId: Joi.string().uuid().required(),
  date: Joi.date().min('now').required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().greater(Joi.ref('startTime')).required(),
  notes: Joi.string().max(500).optional()
});

class AppointmentService {
  static async createAppointment(appointmentData, salonId) {
    try {
      // Validate input
      const { error, value } = appointmentSchema.validate(appointmentData);
      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
      }

      // Verify customer belongs to salon
      const customer = await Customer.findById(value.customerId);
      if (!customer || customer.salonId !== salonId) {
        throw new Error('Customer not found or does not belong to this salon');
      }

      // Verify staff belongs to salon
      const staff = await User.findById(value.staffId);
      if (!staff || staff.salonId !== salonId || staff.role === 'SUPER_ADMIN') {
        throw new Error('Staff not found or does not belong to this salon');
      }

      // Verify service belongs to salon
      const service = await Service.findById(value.serviceId);
      if (!service || service.salonId !== salonId || !service.isActive) {
        throw new Error('Service not found or not available');
      }

      // Check staff availability
      const isAvailable = await Appointment.checkAvailability(
        value.staffId,
        value.startTime,
        value.endTime
      );

      if (!isAvailable) {
        throw new Error('Staff member is not available at the selected time');
      }

      value.salonId = salonId;
      value.status = 'SCHEDULED';

      const appointment = await Appointment.create(value);
      
      return appointment;
    } catch (error) {
      throw new Error(`Appointment creation failed: ${error.message}`);
    }
  }

  static async updateAppointment(appointmentId, appointmentData, userSalonId) {
    try {
      const existingAppointment = await Appointment.findById(appointmentId);
      
      if (!existingAppointment) {
        throw new Error('Appointment not found');
      }

      // Check salon access
      if (existingAppointment.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      // If updating time or staff, check availability
      if (appointmentData.startTime || appointmentData.endTime || appointmentData.staffId) {
        const startTime = appointmentData.startTime || existingAppointment.startTime;
        const endTime = appointmentData.endTime || existingAppointment.endTime;
        const staffId = appointmentData.staffId || existingAppointment.staffId;

        const isAvailable = await Appointment.checkAvailability(
          staffId,
          startTime,
          endTime,
          appointmentId
        );

        if (!isAvailable) {
          throw new Error('Staff member is not available at the selected time');
        }
      }

      const appointment = await Appointment.update(appointmentId, appointmentData);
      
      return appointment;
    } catch (error) {
      throw new Error(`Appointment update failed: ${error.message}`);
    }
  }

  static async cancelAppointment(appointmentId, userSalonId) {
    try {
      const existingAppointment = await Appointment.findById(appointmentId);
      
      if (!existingAppointment) {
        throw new Error('Appointment not found');
      }

      // Check salon access
      if (existingAppointment.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      const appointment = await Appointment.update(appointmentId, { 
        status: 'CANCELLED' 
      });
      
      return appointment;
    } catch (error) {
      throw new Error(`Appointment cancellation failed: ${error.message}`);
    }
  }

  static async getAppointments(salonId, filters = {}) {
    try {
      const appointments = await Appointment.findBySalon(salonId, filters);
      return appointments;
    } catch (error) {
      throw new Error(`Failed to fetch appointments: ${error.message}`);
    }
  }

  static async getAppointmentById(appointmentId, userSalonId) {
    try {
      const appointment = await Appointment.findById(appointmentId);
      
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Check salon access
      if (appointment.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      return appointment;
    } catch (error) {
      throw new Error(`Failed to fetch appointment: ${error.message}`);
    }
  }

  static async checkStaffAvailability(staffId, startTime, endTime, userSalonId) {
    try {
      // Verify staff belongs to salon
      const staff = await User.findById(staffId);
      if (!staff || staff.salonId !== userSalonId) {
        throw new Error('Staff not found or does not belong to this salon');
      }

      const isAvailable = await Appointment.checkAvailability(staffId, startTime, endTime);
      
      return { available: isAvailable };
    } catch (error) {
      throw new Error(`Availability check failed: ${error.message}`);
    }
  }

  static async getUpcomingAppointments(salonId, staffId = null) {
    try {
      const filters = { 
        status: 'SCHEDULED',
        date: new Date().toISOString().split('T')[0] // Today's date
      };
      
      if (staffId) {
        filters.staffId = staffId;
      }

      const appointments = await Appointment.findBySalon(salonId, filters);
      return appointments;
    } catch (error) {
      throw new Error(`Failed to fetch upcoming appointments: ${error.message}`);
    }
  }

  static async completeAppointment(appointmentId, userSalonId) {
    try {
      const existingAppointment = await Appointment.findById(appointmentId);
      
      if (!existingAppointment) {
        throw new Error('Appointment not found');
      }

      // Check salon access
      if (existingAppointment.salonId !== userSalonId) {
        throw new Error('Access denied');
      }

      if (existingAppointment.status !== 'IN_PROGRESS') {
        throw new Error('Only in-progress appointments can be completed');
      }

      const appointment = await Appointment.update(appointmentId, { 
        status: 'COMPLETED' 
      });
      
      return appointment;
    } catch (error) {
      throw new Error(`Appointment completion failed: ${error.message}`);
    }
  }
}

module.exports = AppointmentService;