import api from './api'

/**
 * Companies Service
 * Handles company-related API operations
 */

const companiesService = {
  /**
   * Get all companies
   * @returns {Promise} Array of companies
   */
  getAll: async () => {
    const response = await api.get('/companies/')
    return response.data
  },

  /**
   * Get single company by ID
   * @param {number} id - Company ID
   * @returns {Promise} Company data
   */
  getById: async (id) => {
    const response = await api.get(`/companies/${id}`)
    return response.data
  },

  /**
   * Create new company
   * @param {Object} companyData - Company data
   * @returns {Promise} Created company data
   */
  create: async (companyData) => {
    const response = await api.post('/companies/', companyData)
    return response.data
  },

  /**
   * Update company
   * @param {number} id - Company ID
   * @param {Object} companyData - Updated company data
   * @returns {Promise} Updated company data
   */
  update: async (id, companyData) => {
    const response = await api.put(`/companies/${id}`, companyData)
    return response.data
  },

  /**
   * Delete company
   * @param {number} id - Company ID
   * @returns {Promise} Success response
   */
  delete: async (id) => {
    const response = await api.delete(`/companies/${id}`)
    return response.data
  },

  /**
   * Search companies
   * @param {string} query - Search query
   * @returns {Promise} Array of matching companies
   */
  search: async (query) => {
    const response = await api.get('/companies/', {
      params: { search: query },
    })
    return response.data
  },
}

export default companiesService
