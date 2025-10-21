const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Service {
  static async findById(id) {
    return await prisma.service.findUnique({
      where: { id },
      include: {
        salon: true
      }
    });
  }

  static async create(serviceData) {
    return await prisma.service.create({
      data: serviceData,
      include: {
        salon: true
      }
    });
  }

  static async update(id, serviceData) {
    return await prisma.service.update({
      where: { id },
      data: serviceData,
      include: {
        salon: true
      }
    });
  }

  static async delete(id) {
    return await prisma.service.update({
      where: { id },
      data: { isActive: false }
    });
  }

  static async findBySalon(salonId, activeOnly = true) {
    const where = { salonId };
    if (activeOnly) where.isActive = true;

    return await prisma.service.findMany({
      where,
      include: {
        salon: true
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  static async findPopularServices(salonId, limit = 10) {
    return await prisma.service.findMany({
      where: {
        salonId,
        isActive: true
      },
      include: {
        _count: {
          select: {
            appointments: {
              where: {
                status: 'COMPLETED'
              }
            }
          }
        }
      },
      orderBy: {
        appointments: {
          _count: 'desc'
        }
      },
      take: limit
    });
  }
}

module.exports = Service;