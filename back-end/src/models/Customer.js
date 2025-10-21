const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Customer {
  static async findById(id) {
    return await prisma.customer.findUnique({
      where: { id },
      include: {
        salon: true,
        appointments: {
          include: {
            service: true,
            staff: true
          }
        },
        payments: true
      }
    });
  }

  static async findByPhone(phone, salonId) {
    return await prisma.customer.findUnique({
      where: {
        phone_salonId: {
          phone,
          salonId
        }
      },
      include: {
        salon: true,
        appointments: {
          include: {
            service: true,
            staff: true
          }
        }
      }
    });
  }

  static async create(customerData) {
    return await prisma.customer.create({
      data: customerData,
      include: {
        salon: true
      }
    });
  }

  static async update(id, customerData) {
    return await prisma.customer.update({
      where: { id },
      data: customerData,
      include: {
        salon: true,
        appointments: {
          include: {
            service: true,
            staff: true
          }
        }
      }
    });
  }

  static async delete(id) {
    return await prisma.customer.delete({
      where: { id }
    });
  }

  static async findBySalon(salonId, searchTerm = null) {
    const where = { salonId };
    
    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { phone: { contains: searchTerm } },
        { email: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    return await prisma.customer.findMany({
      where,
      include: {
        salon: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getServiceHistory(customerId) {
    return await prisma.appointment.findMany({
      where: {
        customerId,
        status: 'COMPLETED'
      },
      include: {
        service: true,
        staff: true,
        payment: true
      },
      orderBy: {
        date: 'desc'
      }
    });
  }
}

module.exports = Customer;