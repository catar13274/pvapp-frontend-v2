import api from './api'

/**
 * Authentication Service
 * Handles user authentication operations
 */

const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Response with user data and token
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Response with user data and token
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  getProfile: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} Updated user data
   */
  updateProfile: async (userData) => {
    const response = await api.put('/auth/me', userData)
    return response.data
  },

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Success response
   */
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    })
    return response.data
  },

  /**
   * Logout (optional, mainly for token invalidation on backend)
   * @returns {Promise} Success response
   */
  logout: async () => {
    try {
      const response = await api.post('/auth/logout')
      return response.data
    } catch (error) {
      // Even if backend logout fails, clear local state
      return { success: true }
    }
  },
}

export default authService
