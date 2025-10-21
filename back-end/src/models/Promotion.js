const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Promotion {
  static async findById(id) {
    return await prisma.promotion.findUnique({
      where: { id },
      include: {
        creator: true,
        salon: true
      }
    });
  }

  static async create(promotionData) {
    return await prisma.promotion.create({
      data: promotionData,
      include: {
        creator: true,
        salon: true
      }
    });
  }

  static async update(id, promotionData) {
    return await prisma.promotion.update({
      where: { id },
      data: promotionData,
      include: {
        creator: true,
        salon: true
      }
    });
  }

  static async delete(id) {
    return await prisma.promotion.delete({
      where: { id }
    });
  }

  static async findBySalon(salonId, status = null) {
    const where = { salonId };
    if (status) where.status = status;

    return await prisma.promotion.findMany({
      where,
      include: {
        creator: true,
        salon: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async findScheduledPromotions() {
    const now = new Date();
    
    return await prisma.promotion.findMany({
      where: {
        status: 'ACTIVE',
        scheduledAt: {
          lte: now
        },
        sentAt: null
      },
      include: {
        creator: true,
        salon: true
      }
    });
  }

  static async markAsSent(id) {
    return await prisma.promotion.update({
      where: { id },
      data: {
        sentAt: new Date(),
        status: 'ACTIVE'
      }
    });
  }
}

module.exports = Promotion;