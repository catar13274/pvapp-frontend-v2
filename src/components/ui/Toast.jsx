import React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

/**
 * Toast Component
 * Temporary notification message
 */

const toastVariants = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-900',
    icon: CheckCircle,
    iconColor: 'text-green-600',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-900',
    icon: AlertCircle,
    iconColor: 'text-red-600',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-900',
    icon: Info,
    iconColor: 'text-blue-600',
  },
}

export const Toast = ({
  variant = 'info',
  title,
  description,
  onClose,
  className,
  ...props
}) => {
  const { container, icon: Icon, iconColor } = toastVariants[variant]

  return (
    <div
      className={cn(
        'rounded-lg border p-4 shadow-lg flex gap-3 max-w-md',
        'animate-slide-in-from-top',
        container,
        className
      )}
      role="alert"
      {...props}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0', iconColor)} />
      
      <div className="flex-1">
        {title && (
          <p className="font-semibold">{title}</p>
        )}
        {description && (
          <p className="text-sm mt-1">{description}</p>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current hover:opacity-70 transition-opacity"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

/**
 * Toast Container for displaying multiple toasts
 */
export const ToastContainer = ({ children, className }) => {
  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex flex-col gap-2',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Simple toast hook for programmatic usage
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const [toasts, setToasts] = React.useState([])

  const addToast = React.useCallback((toast) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { ...toast, id }])

    // Auto-remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.duration || 5000)
  }, [])

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}
