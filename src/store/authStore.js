import { create } from 'zustand'

/**
 * Authentication Store
 * Manages user authentication state and JWT token
 */
const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  /**
   * Set authentication data
   * @param {Object} user - User object
   * @param {string} token - JWT token
   */
  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token, isAuthenticated: true })
  },

  /**
   * Update user data
   * @param {Object} user - User object
   */
  setUser: (user) => {
    set({ user })
  },

  /**
   * Logout and clear authentication data
   */
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  checkAuth: () => {
    const token = localStorage.getItem('token')
    set({ isAuthenticated: !!token, token })
    return !!token
  },
}))

export default useAuthStore
