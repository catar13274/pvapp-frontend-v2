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
import { useCreateCompany, useUpdateCompany } from '@/hooks/useCompanies'

/**
 * Company Dialog Component
 * Create or edit company
 */

const CompanyDialog = ({ open, onOpenChange, company = null }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = React.useState({})

  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()

  const isEditing = !!company

  React.useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        code: company.code || '',
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || '',
      })
    } else {
      setFormData({
        name: '',
        code: '',
        address: '',
        phone: '',
        email: '',
      })
    }
    setErrors({})
  }, [company, open])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.code) newErrors.code = 'Code is required'
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return

    try {
      if (isEditing) {
        await updateCompany.mutateAsync({ id: company.id, data: formData })
      } else {
        await createCompany.mutateAsync(formData)
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving company:', error)
    }
  }

  const mutation = isEditing ? updateCompany : createCompany

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Company' : 'New Company'}
          </DialogTitle>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody>
            {mutation.isError && (
              <Alert variant="error" className="mb-4">
                {mutation.error?.message || 'Failed to save company'}
              </Alert>
            )}

            <FormGroup label="Company Name" error={errors.name} required>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Acme Corp"
              />
            </FormGroup>

            <FormGroup label="Company Code" error={errors.code} required>
              <Input
                name="code"
                value={formData.code}
                onChange={handleChange}
                error={errors.code}
                placeholder="ACME"
              />
            </FormGroup>

            <FormGroup label="Address" error={errors.address}>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, State"
              />
            </FormGroup>

            <FormGroup label="Phone" error={errors.phone}>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
              />
            </FormGroup>

            <FormGroup label="Email" error={errors.email}>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="contact@company.com"
              />
            </FormGroup>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
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

export default CompanyDialog
