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
import { Select, SelectOption } from '@/components/ui/Select'
import { FormGroup } from '@/components/ui/Label'
import { Alert } from '@/components/ui/Alert'
import { useCreatePurchase, useUpdatePurchase } from '@/hooks/usePurchases'
import useCompanyStore from '@/store/companyStore'

/**
 * Purchase Dialog Component
 */

const PurchaseDialog = ({ open, onOpenChange, purchase = null }) => {
  const { selectedCompany } = useCompanyStore()
  const [formData, setFormData] = React.useState({
    invoice_number: '',
    supplier_name: '',
    purchase_date: new Date().toISOString().split('T')[0],
    total_amount: 0,
    status: 'pending',
    notes: '',
  })
  const [errors, setErrors] = React.useState({})

  const createPurchase = useCreatePurchase()
  const updatePurchase = useUpdatePurchase()
  const isEditing = !!purchase

  React.useEffect(() => {
    if (purchase) {
      setFormData({
        invoice_number: purchase.invoice_number || '',
        supplier_name: purchase.supplier_name || '',
        purchase_date: purchase.purchase_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        total_amount: purchase.total_amount || 0,
        status: purchase.status || 'pending',
        notes: purchase.notes || '',
      })
    } else {
      setFormData({
        invoice_number: '',
        supplier_name: '',
        purchase_date: new Date().toISOString().split('T')[0],
        total_amount: 0,
        status: 'pending',
        notes: '',
      })
    }
    setErrors({})
  }, [purchase, open])

  const handleChange = (e) => {
    const value = e.target.name === 'total_amount' 
      ? parseFloat(e.target.value) || 0 
      : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.invoice_number) newErrors.invoice_number = 'Invoice number is required'
    if (!formData.supplier_name) newErrors.supplier_name = 'Supplier name is required'
    if (!formData.purchase_date) newErrors.purchase_date = 'Purchase date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const dataToSend = { ...formData, company_id: selectedCompany.id }
      if (isEditing) {
        await updatePurchase.mutateAsync({ id: purchase.id, data: dataToSend })
      } else {
        await createPurchase.mutateAsync(dataToSend)
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving purchase:', error)
    }
  }

  const mutation = isEditing ? updatePurchase : createPurchase

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Purchase' : 'New Purchase'}</DialogTitle>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody>
            {mutation.isError && (
              <Alert variant="error" className="mb-4">
                {mutation.error?.message || 'Failed to save purchase'}
              </Alert>
            )}

            <FormGroup label="Invoice Number" error={errors.invoice_number} required>
              <Input
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
                error={errors.invoice_number}
                placeholder="INV-001"
              />
            </FormGroup>

            <FormGroup label="Supplier Name" error={errors.supplier_name} required>
              <Input
                name="supplier_name"
                value={formData.supplier_name}
                onChange={handleChange}
                error={errors.supplier_name}
                placeholder="Supplier name"
              />
            </FormGroup>

            <div className="grid grid-cols-2 gap-4">
              <FormGroup label="Purchase Date" error={errors.purchase_date} required>
                <Input
                  name="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={handleChange}
                  error={errors.purchase_date}
                />
              </FormGroup>

              <FormGroup label="Total Amount">
                <Input
                  name="total_amount"
                  type="number"
                  value={formData.total_amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                />
              </FormGroup>
            </div>

            <FormGroup label="Status">
              <Select name="status" value={formData.status} onChange={handleChange}>
                <SelectOption value="pending">Pending</SelectOption>
                <SelectOption value="completed">Completed</SelectOption>
                <SelectOption value="cancelled">Cancelled</SelectOption>
              </Select>
            </FormGroup>

            <FormGroup label="Notes">
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes..."
              />
            </FormGroup>
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

export default PurchaseDialog
