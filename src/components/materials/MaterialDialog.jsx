import React from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogBody, 
  DialogFooter,
  DialogClose 
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { FormGroup } from '@/components/ui/Label'
import { Alert } from '@/components/ui/Alert'
import { useCreateMaterial, useUpdateMaterial } from '@/hooks/useMaterials'
import useCompanyStore from '@/store/companyStore'

/**
 * Material Dialog Component
 */

const MaterialDialog = ({ open, onOpenChange, material = null }) => {
  const { selectedCompany } = useCompanyStore()
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    unit: '',
    min_stock: 0,
    current_stock: 0,
  })
  const [errors, setErrors] = React.useState({})

  const createMaterial = useCreateMaterial()
  const updateMaterial = useUpdateMaterial()
  const isEditing = !!material

  React.useEffect(() => {
    if (material) {
      setFormData({
        name: material.name || '',
        description: material.description || '',
        sku: material.sku || '',
        barcode: material.barcode || '',
        unit: material.unit || '',
        min_stock: material.min_stock || 0,
        current_stock: material.current_stock || 0,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        sku: '',
        barcode: '',
        unit: '',
        min_stock: 0,
        current_stock: 0,
      })
    }
    setErrors({})
  }, [material, open])

  const handleChange = (e) => {
    const value = ['min_stock', 'current_stock'].includes(e.target.name)
      ? parseFloat(e.target.value) || 0
      : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.unit) newErrors.unit = 'Unit is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const dataToSend = { ...formData, company_id: selectedCompany.id }
      if (isEditing) {
        await updateMaterial.mutateAsync({ id: material.id, data: dataToSend })
      } else {
        await createMaterial.mutateAsync(dataToSend)
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving material:', error)
    }
  }

  const mutation = isEditing ? updateMaterial : createMaterial

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Material' : 'New Material'}</DialogTitle>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody>
            {mutation.isError && (
              <Alert variant="error" className="mb-4">
                {mutation.error?.message || 'Failed to save material'}
              </Alert>
            )}

            <FormGroup label="Material Name" error={errors.name} required>
              <Input name="name" value={formData.name} onChange={handleChange} error={errors.name} />
            </FormGroup>

            <FormGroup label="Description">
              <Textarea name="description" value={formData.description} onChange={handleChange} />
            </FormGroup>

            <div className="grid grid-cols-2 gap-4">
              <FormGroup label="SKU">
                <Input name="sku" value={formData.sku} onChange={handleChange} />
              </FormGroup>

              <FormGroup label="Barcode">
                <Input name="barcode" value={formData.barcode} onChange={handleChange} />
              </FormGroup>
            </div>

            <FormGroup label="Unit" error={errors.unit} required>
              <Input name="unit" value={formData.unit} onChange={handleChange} placeholder="kg, pcs, m, etc." error={errors.unit} />
            </FormGroup>

            <div className="grid grid-cols-2 gap-4">
              <FormGroup label="Min Stock">
                <Input name="min_stock" type="number" value={formData.min_stock} onChange={handleChange} step="0.01" />
              </FormGroup>

              <FormGroup label="Current Stock">
                <Input name="current_stock" type="number" value={formData.current_stock} onChange={handleChange} step="0.01" />
              </FormGroup>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default MaterialDialog
