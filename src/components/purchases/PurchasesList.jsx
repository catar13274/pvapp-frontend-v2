import React from 'react'
import { Search, Plus, Eye, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '@/components/ui/Table'
import { Spinner } from '@/components/ui/Loading'
import { usePurchasesByCompany, useDeletePurchase } from '@/hooks/usePurchases'
import useCompanyStore from '@/store/companyStore'
import { formatDate, formatCurrency, debounce } from '@/lib/utils'
import PurchaseDialog from './PurchaseDialog'

/**
 * Purchases List Component
 */

const PurchasesList = () => {
  const { selectedCompany } = useCompanyStore()
  const [search, setSearch] = React.useState('')
  const [selectedPurchase, setSelectedPurchase] = React.useState(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const { data: purchases = [], isLoading } = usePurchasesByCompany(selectedCompany?.id)
  const deletePurchase = useDeletePurchase()

  const filteredPurchases = React.useMemo(() => {
    if (!search) return purchases
    const query = search.toLowerCase()
    return purchases.filter(
      (p) =>
        p.invoice_number?.toLowerCase().includes(query) ||
        p.supplier_name?.toLowerCase().includes(query)
    )
  }, [purchases, search])

  const handleSearch = debounce((value) => setSearch(value), 300)

  const handleNew = () => {
    setSelectedPurchase(null)
    setDialogOpen(true)
  }

  const handleView = (purchase) => {
    setSelectedPurchase(purchase)
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this purchase?')) {
      try {
        await deletePurchase.mutateAsync(id)
      } catch (error) {
        alert('Failed to delete purchase')
      }
    }
  }

  if (!selectedCompany) {
    return (
      <Card className="p-8 text-center">
        <p className="text-slate-600">Please select a company first</p>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <Card>
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search purchases..."
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleNew}>
              <Plus className="w-5 h-5 mr-2" />
              New Purchase
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.length === 0 ? (
                <TableEmpty colSpan={6} message="No purchases found" />
              ) : (
                filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.invoice_number}</TableCell>
                    <TableCell>{purchase.supplier_name || '-'}</TableCell>
                    <TableCell>{formatDate(purchase.purchase_date)}</TableCell>
                    <TableCell>{formatCurrency(purchase.total_amount || 0)}</TableCell>
                    <TableCell>
                      <Badge variant={purchase.status === 'completed' ? 'success' : 'warning'}>
                        {purchase.status || 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleView(purchase)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(purchase.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <PurchaseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        purchase={selectedPurchase}
      />
    </>
  )
}

export default PurchasesList
