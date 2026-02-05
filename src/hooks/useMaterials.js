import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import materialsService from '@/services/materialsService'

/**
 * Custom hooks for materials operations
 */

// Query keys
export const MATERIALS_QUERY_KEY = 'materials'
export const MATERIAL_MOVEMENTS_QUERY_KEY = 'material-movements'
export const LOW_STOCK_QUERY_KEY = 'low-stock'

/**
 * Hook to fetch all materials
 */
export const useMaterials = (params = {}) => {
  return useQuery({
    queryKey: [MATERIALS_QUERY_KEY, params],
    queryFn: () => materialsService.getAll(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
  })
}

/**
 * Hook to fetch materials by company
 */
export const useMaterialsByCompany = (companyId) => {
  return useQuery({
    queryKey: [MATERIALS_QUERY_KEY, 'company', companyId],
    queryFn: () => materialsService.getByCompany(companyId),
    enabled: !!companyId,
    staleTime: 3 * 60 * 1000,
  })
}

/**
 * Hook to fetch single material
 */
export const useMaterial = (id) => {
  return useQuery({
    queryKey: [MATERIALS_QUERY_KEY, id],
    queryFn: () => materialsService.getById(id),
    enabled: !!id,
  })
}

/**
 * Hook to fetch material movements
 */
export const useMaterialMovements = (id) => {
  return useQuery({
    queryKey: [MATERIAL_MOVEMENTS_QUERY_KEY, id],
    queryFn: () => materialsService.getMovements(id),
    enabled: !!id,
  })
}

/**
 * Hook to fetch low stock materials
 */
export const useLowStock = (companyId) => {
  return useQuery({
    queryKey: [LOW_STOCK_QUERY_KEY, companyId],
    queryFn: () => materialsService.getLowStock(companyId),
    enabled: !!companyId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to create material
 */
export const useCreateMaterial = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (materialData) => materialsService.create(materialData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY] })
    },
  })
}

/**
 * Hook to update material
 */
export const useUpdateMaterial = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => materialsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY] })
    },
  })
}

/**
 * Hook to delete material
 */
export const useDeleteMaterial = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => materialsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY] })
    },
  })
}

/**
 * Hook to adjust material stock
 */
export const useAdjustStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => materialsService.adjustStock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [MATERIAL_MOVEMENTS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [LOW_STOCK_QUERY_KEY] })
    },
  })
}
