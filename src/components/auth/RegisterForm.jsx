import React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormGroup } from '@/components/ui/Label'
import { Alert } from '@/components/ui/Alert'
import { useRegister } from '@/hooks/useAuth'

/**
 * Register Form Component
 */

const RegisterForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = React.useState({})

  const register = useRegister()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.name) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...userData } = formData
    register.mutate(userData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {register.isError && (
        <Alert variant="error" title="Registration Failed">
          {register.error?.message || 'Failed to create account'}
        </Alert>
      )}

      <FormGroup label="Full Name" error={errors.name} required>
        <Input
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
          autoFocus
        />
      </FormGroup>

      <FormGroup label="Email" error={errors.email} required>
        <Input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
      </FormGroup>

      <FormGroup label="Password" error={errors.password} required>
        <Input
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />
      </FormGroup>

      <FormGroup label="Confirm Password" error={errors.confirmPassword} required>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
      </FormGroup>

      <Button
        type="submit"
        className="w-full"
        disabled={register.isPending}
      >
        {register.isPending ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}

export default RegisterForm
