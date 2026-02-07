import React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormGroup } from '@/components/ui/Label'
import { Alert } from '@/components/ui/Alert'
import { useLogin } from '@/hooks/useAuth'

/**
 * Login Form Component
 */

const LoginForm = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errors, setErrors] = React.useState({})

  const login = useLogin()

  const validate = () => {
    const newErrors = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    login.mutate({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {login.isError && (
        <Alert variant="error" title="Login Failed">
          {login.error?.message || 'Invalid email or password'}
        </Alert>
      )}

      <FormGroup label="Email" error={errors.email} required>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
          autoFocus
        />
      </FormGroup>

      <FormGroup label="Password" error={errors.password} required>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />
      </FormGroup>

      <Button
        type="submit"
        className="w-full"
        disabled={login.isPending}
      >
        {login.isPending ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}

export default LoginForm
