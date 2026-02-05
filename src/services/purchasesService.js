import api from './api'

/**
 * Purchases Service
 * Handles purchase-related API operations
 */

const purchasesService = {
  /**
   * Get all purchases
   * @param {Object} params - Query parameters
   * @returns {Promise} Array of purchases
   */
  getAll: async (params = {}) => {
    const response = await api.get('/purchases/', { params })
    return response.data
  },

  /**
   * Get single purchase by ID
   * @param {number} id - Purchase ID
   * @returns {Promise} Purchase data
   */
  getById: async (id) => {
    const response = await api.get(`/purchases/${id}`)
    return response.data
  },

  /**
   * Create new purchase
   * @param {Object} purchaseData - Purchase data
   * @returns {Promise} Created purchase data
   */
  create: async (purchaseData) => {
    const response = await api.post('/purchases/', purchaseData)
    return response.data
  },

  /**
   * Update purchase
   * @param {number} id - Purchase ID
   * @param {Object} purchaseData - Updated purchase data
   * @returns {Promise} Updated purchase data
   */
  update: async (id, purchaseData) => {
    const response = await api.put(`/purchases/${id}`, purchaseData)
    return response.data
  },

  /**
   * Delete purchase
   * @param {number} id - Purchase ID
   * @returns {Promise} Success response
   */
  delete: async (id) => {
    const response = await api.delete(`/purchases/${id}`)
    return response.data
  },

  /**
   * Get purchase items
   * @param {number} id - Purchase ID
   * @returns {Promise} Array of purchase items
   */
  getItems: async (id) => {
    const response = await api.get(`/purchases/${id}/items`)
    return response.data
  },

  /**
   * Add item to purchase
   * @param {number} id - Purchase ID
   * @param {Object} itemData - Item data
   * @returns {Promise} Created item data
   */
  addItem: async (id, itemData) => {
    const response = await api.post(`/purchases/${id}/items`, itemData)
    return response.data
  },

  /**
   * Update purchase item
   * @param {number} purchaseId - Purchase ID
   * @param {number} itemId - Item ID
   * @param {Object} itemData - Updated item data
   * @returns {Promise} Updated item data
   */
  updateItem: async (purchaseId, itemId, itemData) => {
    const response = await api.put(`/purchases/${purchaseId}/items/${itemId}`, itemData)
    return response.data
  },

  /**
   * Delete purchase item
   * @param {number} purchaseId - Purchase ID
   * @param {number} itemId - Item ID
   * @returns {Promise} Success response
   */
  deleteItem: async (purchaseId, itemId) => {
    const response = await api.delete(`/purchases/${purchaseId}/items/${itemId}`)
    return response.data
  },

  /**
   * Get purchases by company
   * @param {number} companyId - Company ID
   * @returns {Promise} Array of purchases
   */
  getByCompany: async (companyId) => {
    const response = await api.get('/purchases/', {
      params: { company_id: companyId },
    })
    return response.data
  },

  /**
   * Search purchases
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} Array of matching purchases
   */
  search: async (query, filters = {}) => {
    const response = await api.get('/purchases/', {
      params: { search: query, ...filters },
    })
    return response.data
  },
}

export default purchasesService
