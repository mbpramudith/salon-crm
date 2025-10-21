const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Payment {
  static async findById(id) {
    return await prisma.payment.findUnique({
      where: { id },
      include: {
        appointment: {
          include: {
            service: true
          }
        },
        customer: true,
        staff: true,
        salon: true
      }
    });
  }

  static async create(paymentData) {
    return await prisma.payment.create({
      data: paymentData,
      include: {
        appointment: {
          include: {
            service: true
          }
        },
        customer: true,
        staff: true,
        salon: true
      }
    });
  }

  static async update(id, paymentData) {
    return await prisma.payment.update({
      where: { id },
      data: paymentData,
      include: {
        appointment: {
          include: {
            service: true
          }
        },
        customer: true,
        staff: true,
        salon: true
      }
    });
  }

  static async findBySalon(salonId, filters = {}) {
    const where = { salonId };
    
    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate)
      };
    }
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.staffId) {
      where.staffId = filters.staffId;
    }

    return await prisma.payment.findMany({
      where,
      include: {
        appointment: {
          include: {
            service: true
          }
        },
        customer: true,
        staff: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getTotalEarnings(salonId, startDate, endDate) {
    const result = await prisma.payment.aggregate({
      where: {
        salonId,
        status: 'COMPLETED',
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      _sum: {
        amount: true
      }
    });

    return result._sum.amount || 0;
  }

  static async getStaffEarnings(staffId, startDate, endDate) {
    const result = await prisma.payment.aggregate({
      where: {
        staffId,
        status: 'COMPLETED',
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      _sum: {
        amount: true
      }
    });

    return result._sum.amount || 0;
  }
}

module.exports = Payment;