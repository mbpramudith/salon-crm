const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

class User {
  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        salon: true
      }
    });
  }

  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        salon: true
      }
    });
  }

  static async findByApiKey(apiKey) {
    return await prisma.user.findUnique({
      where: { apiKey },
      include: {
        salon: true
      }
    });
  }

  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      },
      include: {
        salon: true
      }
    });
  }

  static async update(id, userData) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    return await prisma.user.update({
      where: { id },
      data: userData,
      include: {
        salon: true
      }
    });
  }

  static async delete(id) {
    return await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });
  }

  static async findBySalon(salonId, role = null) {
    const where = { salonId, isActive: true };
    if (role) where.role = role;

    return await prisma.user.findMany({
      where,
      include: {
        salon: true
      }
    });
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;