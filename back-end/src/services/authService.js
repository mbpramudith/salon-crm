const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

class AuthService {
  static async login(email, password) {
    try {
      const user = await User.findByEmail(email);
      
      if (!user || !user.isActive) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await User.validatePassword(password, user.password);
      
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(user);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  static async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);
      
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Generate API key
      userData.apiKey = `salon_${uuidv4().replace(/-/g, '')}`;

      const user = await User.create(userData);
      const token = generateToken(user);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  static async refreshToken(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      const token = generateToken(user);
      
      return { token };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await User.validatePassword(currentPassword, user.password);
      
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      await User.update(userId, { password: newPassword });
      
      return { success: true };
    } catch (error) {
      throw new Error(`Password change failed: ${error.message}`);
    }
  }

  static async generateNewApiKey(userId) {
    try {
      const newApiKey = `salon_${uuidv4().replace(/-/g, '')}`;
      
      const user = await User.update(userId, { apiKey: newApiKey });
      
      return { apiKey: newApiKey };
    } catch (error) {
      throw new Error(`API key generation failed: ${error.message}`);
    }
  }
}

module.exports = AuthService;