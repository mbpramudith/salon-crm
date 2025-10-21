const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Appointment {
  static async findById(id) {
    return await prisma.appointment.findUnique({
      where: { id },
      include: {
        customer: true,
        staff: true,
        service: true,
        salon: true,
        payment: true
      }
    });
  }

  static async create(appointmentData) {
    return await prisma.appointment.create({
      data: appointmentData,
      include: {
        customer: true,
        staff: true,
        service: true,
        salon: true
      }
    });
  }

  static async update(id, appointmentData) {
    return await prisma.appointment.update({
      where: { id },
      data: appointmentData,
      include: {
        customer: true,
        staff: true,
        service: true,
        salon: true,
        payment: true
      }
    });
  }

  static async delete(id) {
    return await prisma.appointment.delete({
      where: { id }
    });
  }

  static async findBySalon(salonId, filters = {}) {
    const where = { salonId };
    
    if (filters.date) {
      where.date = {
        gte: new Date(filters.date),
        lt: new Date(new Date(filters.date).getTime() + 24 * 60 * 60 * 1000)
      };
    }
    
    if (filters.staffId) {
      where.staffId = filters.staffId;
    }
    
    if (filters.status) {
      where.status = filters.status;
    }

    return await prisma.appointment.findMany({
      where,
      include: {
        customer: true,
        staff: true,
        service: true,
        payment: true
      },
      orderBy: {
        startTime: 'asc'
      }
    });
  }

  static async checkAvailability(staffId, startTime, endTime, excludeId = null) {
    const where = {
      staffId,
      status: { not: 'CANCELLED' },
      OR: [
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime }
        }
      ]
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const conflictingAppointments = await prisma.appointment.findMany({
      where
    });

    return conflictingAppointments.length === 0;
  }

  static async findUpcomingReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    return await prisma.appointment.findMany({
      where: {
        date: {
          gte: tomorrow,
          lt: dayAfterTomorrow
        },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
        reminderSent: false
      },
      include: {
        customer: true,
        staff: true,
        service: true,
        salon: true
      }
    });
  }

  static async markReminderSent(id) {
    return await prisma.appointment.update({
      where: { id },
      data: { reminderSent: true }
    });
  }
}

module.exports = Appointment;