import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import authService from '@/services/authService'
import useAuthStore from '@/store/authStore'

/**
 * Custom hook for authentication operations
 */

export const useLogin = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token)
      navigate('/dashboard')
    },
  })
}

export const useRegister = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: (userData) => authService.register(userData),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token)
      navigate('/dashboard')
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout()
      navigate('/login')
    },
    onError: () => {
      // Logout locally even if API call fails
      logout()
      navigate('/login')
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      authService.changePassword(currentPassword, newPassword),
  })
}
