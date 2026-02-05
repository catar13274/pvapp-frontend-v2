import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import purchasesService from '@/services/purchasesService'

/**
 * Custom hooks for purchases operations
 */

// Query keys
export const PURCHASES_QUERY_KEY = 'purchases'
export const PURCHASE_ITEMS_QUERY_KEY = 'purchase-items'

/**
 * Hook to fetch all purchases
 */
export const usePurchases = (params = {}) => {
  return useQuery({
    queryKey: [PURCHASES_QUERY_KEY, params],
    queryFn: () => purchasesService.getAll(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
  })
}

/**
 * Hook to fetch purchases by company
 */
export const usePurchasesByCompany = (companyId) => {
  return useQuery({
    queryKey: [PURCHASES_QUERY_KEY, 'company', companyId],
    queryFn: () => purchasesService.getByCompany(companyId),
    enabled: !!companyId,
    staleTime: 3 * 60 * 1000,
  })
}

/**
 * Hook to fetch single purchase
 */
export const usePurchase = (id) => {
  return useQuery({
    queryKey: [PURCHASES_QUERY_KEY, id],
    queryFn: () => purchasesService.getById(id),
    enabled: !!id,
  })
}

/**
 * Hook to fetch purchase items
 */
export const usePurchaseItems = (id) => {
  return useQuery({
    queryKey: [PURCHASE_ITEMS_QUERY_KEY, id],
    queryFn: () => purchasesService.getItems(id),
    enabled: !!id,
  })
}

/**
 * Hook to create purchase
 */
export const useCreatePurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (purchaseData) => purchasesService.create(purchaseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PURCHASES_QUERY_KEY] })
    },
  })
}

/**
 * Hook to update purchase
 */
export const useUpdatePurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => purchasesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PURCHASES_QUERY_KEY] })
    },
  })
}

/**
 * Hook to delete purchase
 */
export const useDeletePurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => purchasesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PURCHASES_QUERY_KEY] })
    },
  })
}

/**
 * Hook to add purchase item
 */
export const useAddPurchaseItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ purchaseId, itemData }) => purchasesService.addItem(purchaseId, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ITEMS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [PURCHASES_QUERY_KEY] })
    },
  })
}

/**
 * Hook to update purchase item
 */
export const useUpdatePurchaseItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ purchaseId, itemId, itemData }) =>
      purchasesService.updateItem(purchaseId, itemId, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ITEMS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [PURCHASES_QUERY_KEY] })
    },
  })
}

/**
 * Hook to delete purchase item
 */
export const useDeletePurchaseItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ purchaseId, itemId }) => purchasesService.deleteItem(purchaseId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ITEMS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [PURCHASES_QUERY_KEY] })
    },
  })
}
