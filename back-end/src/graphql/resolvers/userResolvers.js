const AuthService = require('../../services/authService');
const UserService = require('../../services/userService');

const userResolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return context.user;
    },

    users: async (parent, { role }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      return await UserService.getUsers(
        context.user.role,
        context.user.salonId,
        { role }
      );
    },

    user: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      return await UserService.getUserById(
        id,
        context.user.role,
        context.user.salonId
      );
    }
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      return await AuthService.login(email, password);
    },

    register: async (parent, { input }) => {
      return await AuthService.register(input);
    },

    changePassword: async (parent, { currentPassword, newPassword }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      await AuthService.changePassword(context.user.id, currentPassword, newPassword);
      return { success: true, message: 'Password changed successfully' };
    },

    generateApiKey: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      return await AuthService.generateNewApiKey(context.user.id);
    },

    createUser: async (parent, { input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      return await UserService.createUser(
        input,
        context.user.role,
        context.user.salonId
      );
    },

    updateUser: async (parent, { id, input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      return await UserService.updateUser(
        id,
        input,
        context.user.role,
        context.user.salonId
      );
    },

    deleteUser: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      await UserService.deleteUser(
        id,
        context.user.role,
        context.user.salonId
      );
      return { success: true, message: 'User deleted successfully' };
    }
  }
};

module.exports = userResolvers;