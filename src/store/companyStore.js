import { create } from 'zustand'

/**
 * Company Store
 * Manages selected company and companies list
 */
const useCompanyStore = create((set) => ({
  selectedCompany: JSON.parse(localStorage.getItem('selectedCompany') || 'null'),
  companies: [],

  /**
   * Set companies list
   * @param {Array} companies - Array of company objects
   */
  setCompanies: (companies) => {
    set({ companies })
    
    // If there's a selected company, update it with fresh data
    const currentSelected = JSON.parse(localStorage.getItem('selectedCompany') || 'null')
    if (currentSelected) {
      const updatedCompany = companies.find(c => c.id === currentSelected.id)
      if (updatedCompany) {
        localStorage.setItem('selectedCompany', JSON.stringify(updatedCompany))
        set({ selectedCompany: updatedCompany })
      }
    } else if (companies.length > 0) {
      // Auto-select first company if none selected
      const firstCompany = companies[0]
      localStorage.setItem('selectedCompany', JSON.stringify(firstCompany))
      set({ selectedCompany: firstCompany })
    }
  },

  /**
   * Select a company
   * @param {Object} company - Company object
   */
  selectCompany: (company) => {
    localStorage.setItem('selectedCompany', JSON.stringify(company))
    set({ selectedCompany: company })
  },

  /**
   * Clear selected company
   */
  clearSelectedCompany: () => {
    localStorage.removeItem('selectedCompany')
    set({ selectedCompany: null })
  },

  /**
   * Get selected company ID
   * @returns {number|null}
   */
  getSelectedCompanyId: () => {
    const company = JSON.parse(localStorage.getItem('selectedCompany') || 'null')
    return company?.id || null
  },
}))

export default useCompanyStore
