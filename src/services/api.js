import axios from 'axios'
import useAuthStore from '@/store/authStore'

/**
 * API Base Configuration
 * Axios instance with interceptors for authentication and error handling
 */

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor
 * Automatically inject JWT token into requests
 */
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handle common errors and auto-logout on 401
 */
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message)
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        error,
      })
    }

    const { status, data } = error.response

    // Auto-logout on 401 Unauthorized
    if (status === 401) {
      const { logout } = useAuthStore.getState()
      logout()
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // Handle validation errors (422)
    if (status === 422) {
      const validationErrors = data.detail
      return Promise.reject({
        message: 'Validation error',
        errors: validationErrors,
      })
    }

    // Handle other errors
    return Promise.reject({
      message: data.detail || data.message || 'An error occurred',
      status,
      data,
    })
  }
)

/**
 * Helper function to handle API errors
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error.message) return error.message
  if (error.response?.data?.detail) return error.response.data.detail
  if (error.response?.data?.message) return error.response.data.message
  return 'An unexpected error occurred'
}

export default api
