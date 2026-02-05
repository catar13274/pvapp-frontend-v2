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
import { useAdjustStock } from '@/hooks/useMaterials'

/**
 * Stock Adjustment Dialog Component
 */

const StockAdjustment = ({ open, onOpenChange, material }) => {
  const [formData, setFormData] = React.useState({
    quantity: 0,
    type: 'add',
    reason: '',
  })
  const [errors, setErrors] = React.useState({})

  const adjustStock = useAdjustStock()

  React.useEffect(() => {
    setFormData({
      quantity: 0,
      type: 'add',
      reason: '',
    })
    setErrors({})
  }, [open])

  const handleChange = (e) => {
    const value = e.target.name === 'quantity' 
      ? parseFloat(e.target.value) || 0 
      : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0'
    }
    if (!formData.reason) {
      newErrors.reason = 'Reason is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await adjustStock.mutateAsync({
        id: material.id,
        data: {
          quantity: formData.type === 'subtract' ? -formData.quantity : formData.quantity,
          reason: formData.reason,
        },
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Error adjusting stock:', error)
    }
  }

  if (!material) return null

  const newStock = formData.type === 'add' 
    ? material.current_stock + formData.quantity 
    : material.current_stock - formData.quantity

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody>
            {adjustStock.isError && (
              <Alert variant="error" className="mb-4">
                {adjustStock.error?.message || 'Failed to adjust stock'}
              </Alert>
            )}

            <div className="mb-4 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Material</p>
              <p className="font-semibold text-slate-900">{material.name}</p>
              <p className="text-sm text-slate-600 mt-2">Current Stock</p>
              <p className="text-2xl font-bold text-slate-900">
                {material.current_stock} {material.unit}
              </p>
            </div>

            <FormGroup label="Adjustment Type" required>
              <Select name="type" value={formData.type} onChange={handleChange}>
                <SelectOption value="add">Add Stock</SelectOption>
                <SelectOption value="subtract">Remove Stock</SelectOption>
              </Select>
            </FormGroup>

            <FormGroup label="Quantity" error={errors.quantity} required>
              <Input
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                error={errors.quantity}
                step="0.01"
                min="0"
              />
            </FormGroup>

            <FormGroup label="Reason" error={errors.reason} required>
              <Textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                error={errors.reason}
                placeholder="Reason for adjustment..."
              />
            </FormGroup>

            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-sm text-primary-700 font-medium">New Stock</p>
              <p className="text-2xl font-bold text-primary-900">
                {newStock.toFixed(2)} {material.unit}
              </p>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={adjustStock.isPending}>
              {adjustStock.isPending ? 'Adjusting...' : 'Adjust Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default StockAdjustment
