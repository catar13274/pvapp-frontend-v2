import api from './api'

/**
 * Materials Service
 * Handles material-related API operations
 */

const materialsService = {
  /**
   * Get all materials
   * @param {Object} params - Query parameters
   * @returns {Promise} Array of materials
   */
  getAll: async (params = {}) => {
    const response = await api.get('/materials/', { params })
    return response.data
  },

  /**
   * Get single material by ID
   * @param {number} id - Material ID
   * @returns {Promise} Material data
   */
  getById: async (id) => {
    const response = await api.get(`/materials/${id}`)
    return response.data
  },

  /**
   * Create new material
   * @param {Object} materialData - Material data
   * @returns {Promise} Created material data
   */
  create: async (materialData) => {
    const response = await api.post('/materials/', materialData)
    return response.data
  },

  /**
   * Update material
   * @param {number} id - Material ID
   * @param {Object} materialData - Updated material data
   * @returns {Promise} Updated material data
   */
  update: async (id, materialData) => {
    const response = await api.put(`/materials/${id}`, materialData)
    return response.data
  },

  /**
   * Delete material
   * @param {number} id - Material ID
   * @returns {Promise} Success response
   */
  delete: async (id) => {
    const response = await api.delete(`/materials/${id}`)
    return response.data
  },

  /**
   * Adjust material stock
   * @param {number} id - Material ID
   * @param {Object} adjustmentData - Stock adjustment data
   * @returns {Promise} Updated material data
   */
  adjustStock: async (id, adjustmentData) => {
    const response = await api.post(`/materials/${id}/stock/adjust`, adjustmentData)
    return response.data
  },

  /**
   * Get material movements/history
   * @param {number} id - Material ID
   * @returns {Promise} Array of movements
   */
  getMovements: async (id) => {
    const response = await api.get(`/materials/${id}/movements`)
    return response.data
  },

  /**
   * Get low stock materials for a company
   * @param {number} companyId - Company ID
   * @returns {Promise} Array of low stock materials
   */
  getLowStock: async (companyId) => {
    const response = await api.get(`/materials/company/${companyId}/low-stock`)
    return response.data
  },

  /**
   * Search materials
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} Array of matching materials
   */
  search: async (query, filters = {}) => {
    const response = await api.get('/materials/', {
      params: { search: query, ...filters },
    })
    return response.data
  },

  /**
   * Get materials by company
   * @param {number} companyId - Company ID
   * @returns {Promise} Array of materials
   */
  getByCompany: async (companyId) => {
    const response = await api.get('/materials/', {
      params: { company_id: companyId },
    })
    return response.data
  },
}

export default materialsService
