const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

class UserService {
  static async createUser(userData, creatorRole, creatorSalonId = null) {
    try {
      // Role-based validation
      if (creatorRole === 'STAFF') {
        throw new Error('Staff members cannot create users');
      }

      if (creatorRole === 'OWNER' && userData.role === 'SUPER_ADMIN') {
        throw new Error('Owners cannot create super admin users');
      }

      if (creatorRole === 'OWNER' && !creatorSalonId) {
        throw new Error('Owner must belong to a salon');
      }

      // Set salon for non-super-admin users
      if (userData.role !== 'SUPER_ADMIN') {
        userData.salonId = creatorSalonId;
      }

      // Generate API key
      userData.apiKey = `salon_${uuidv4().replace(/-/g, '')}`;

      const user = await User.create(userData);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`User creation failed: ${error.message}`);
    }
  }

  static async updateUser(userId, userData, updaterRole, updaterSalonId = null) {
    try {
      const existingUser = await User.findById(userId);
      
      if (!existingUser) {
        throw new Error('User not found');
      }

      // Role-based validation
      if (updaterRole === 'STAFF') {
        throw new Error('Staff members cannot update users');
      }

      if (updaterRole === 'OWNER') {
        if (existingUser.role === 'SUPER_ADMIN') {
          throw new Error('Owners cannot update super admin users');
        }
        
        if (existingUser.salonId !== updaterSalonId) {
          throw new Error('Owners can only update users from their salon');
        }
      }

      const user = await User.update(userId, userData);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`User update failed: ${error.message}`);
    }
  }

  static async deleteUser(userId, deleterRole, deleterSalonId = null) {
    try {
      const existingUser = await User.findById(userId);
      
      if (!existingUser) {
        throw new Error('User not found');
      }

      // Role-based validation
      if (deleterRole === 'STAFF') {
        throw new Error('Staff members cannot delete users');
      }

      if (deleterRole === 'OWNER') {
        if (existingUser.role === 'SUPER_ADMIN') {
          throw new Error('Owners cannot delete super admin users');
        }
        
        if (existingUser.salonId !== deleterSalonId) {
          throw new Error('Owners can only delete users from their salon');
        }
      }

      await User.delete(userId);
      
      return { success: true };
    } catch (error) {
      throw new Error(`User deletion failed: ${error.message}`);
    }
  }

  static async getUsers(userRole, userSalonId = null, filters = {}) {
    try {
      let users;

      if (userRole === 'SUPER_ADMIN') {
        // Super admin can see all users
        users = await User.findBySalon(null);
      } else if (userRole === 'OWNER') {
        // Owner can see users from their salon
        users = await User.findBySalon(userSalonId, filters.role);
      } else {
        // Staff can see other staff from their salon
        users = await User.findBySalon(userSalonId, 'STAFF');
      }

      // Remove passwords from response
      return users.map(user => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  static async getUserById(userId, requesterRole, requesterSalonId = null) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Role-based access control
      if (requesterRole === 'OWNER' && user.salonId !== requesterSalonId) {
        throw new Error('Access denied');
      }

      if (requesterRole === 'STAFF' && user.id !== userId) {
        throw new Error('Staff can only view their own profile');
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }
}

module.exports = UserService;