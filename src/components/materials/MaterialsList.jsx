import React from 'react'
import { Search, Plus, Edit, Trash2, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '@/components/ui/Table'
import { Spinner } from '@/components/ui/Loading'
import { useMaterialsByCompany, useDeleteMaterial } from '@/hooks/useMaterials'
import useCompanyStore from '@/store/companyStore'
import { debounce } from '@/lib/utils'
import MaterialDialog from './MaterialDialog'
import StockAdjustment from './StockAdjustment'

/**
 * Materials List Component
 */

const MaterialsList = () => {
  const { selectedCompany } = useCompanyStore()
  const [search, setSearch] = React.useState('')
  const [selectedMaterial, setSelectedMaterial] = React.useState(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [stockDialogOpen, setStockDialogOpen] = React.useState(false)

  const { data: materials = [], isLoading } = useMaterialsByCompany(selectedCompany?.id)
  const deleteMaterial = useDeleteMaterial()

  const filteredMaterials = React.useMemo(() => {
    if (!search) return materials
    const query = search.toLowerCase()
    return materials.filter(
      (m) =>
        m.name?.toLowerCase().includes(query) ||
        m.sku?.toLowerCase().includes(query) ||
        m.barcode?.toLowerCase().includes(query)
    )
  }, [materials, search])

  const handleSearch = debounce((value) => setSearch(value), 300)

  const handleNew = () => {
    setSelectedMaterial(null)
    setDialogOpen(true)
  }

  const handleEdit = (material) => {
    setSelectedMaterial(material)
    setDialogOpen(true)
  }

  const handleAdjustStock = (material) => {
    setSelectedMaterial(material)
    setStockDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await deleteMaterial.mutateAsync(id)
      } catch (error) {
        alert('Failed to delete material')
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
                placeholder="Search materials..."
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleNew}>
              <Plus className="w-5 h-5 mr-2" />
              New Material
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.length === 0 ? (
                <TableEmpty colSpan={7} message="No materials found" />
              ) : (
                filteredMaterials.map((material) => {
                  const isLowStock = material.current_stock <= material.min_stock
                  return (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>{material.sku || '-'}</TableCell>
                      <TableCell>{material.barcode || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={isLowStock ? 'text-red-600 font-semibold' : ''}>
                            {material.current_stock}
                          </span>
                          {isLowStock && <TrendingDown className="w-4 h-4 text-red-600" />}
                        </div>
                      </TableCell>
                      <TableCell>{material.unit || '-'}</TableCell>
                      <TableCell>
                        {isLowStock ? (
                          <Badge variant="danger">Low Stock</Badge>
                        ) : (
                          <Badge variant="success">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAdjustStock(material)}
                          >
                            Adjust
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(material)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(material.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <MaterialDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        material={selectedMaterial}
      />

      <StockAdjustment
        open={stockDialogOpen}
        onOpenChange={setStockDialogOpen}
        material={selectedMaterial}
      />
    </>
  )
}

export default MaterialsList
