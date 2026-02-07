import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import companiesService from '@/services/companiesService'
import useCompanyStore from '@/store/companyStore'

/**
 * Custom hooks for company operations
 */

// Query keys
export const COMPANIES_QUERY_KEY = 'companies'

/**
 * Hook to fetch all companies
 */
export const useCompanies = () => {
  const { setCompanies } = useCompanyStore()

  return useQuery({
    queryKey: [COMPANIES_QUERY_KEY],
    queryFn: async () => {
      const data = await companiesService.getAll()
      setCompanies(data)
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch single company
 */
export const useCompany = (id) => {
  return useQuery({
    queryKey: [COMPANIES_QUERY_KEY, id],
    queryFn: () => companiesService.getById(id),
    enabled: !!id,
  })
}

/**
 * Hook to create company
 */
export const useCreateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (companyData) => companiesService.create(companyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEY] })
    },
  })
}

/**
 * Hook to update company
 */
export const useUpdateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => companiesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEY] })
    },
  })
}

/**
 * Hook to delete company
 */
export const useDeleteCompany = () => {
  const queryClient = useQueryClient()
  const { selectedCompany, clearSelectedCompany } = useCompanyStore()

  return useMutation({
    mutationFn: (id) => companiesService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEY] })
      
      // Clear selected company if it was deleted
      if (selectedCompany?.id === deletedId) {
        clearSelectedCompany()
      }
    },
  })
}
