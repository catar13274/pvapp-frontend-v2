import React from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

/**
 * Alert Component
 * Display important messages with different severity levels
 */

const alertVariants = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-900',
    icon: Info,
    iconColor: 'text-blue-600',
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-900',
    icon: CheckCircle,
    iconColor: 'text-green-600',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-900',
    icon: AlertCircle,
    iconColor: 'text-red-600',
  },
}

export const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className,
  ...props
}) => {
  const { container, icon: Icon, iconColor } = alertVariants[variant]

  return (
    <div
      className={cn(
        'rounded-lg border p-4 flex gap-3',
        container,
        className
      )}
      role="alert"
      {...props}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0', iconColor)} />
      
      <div className="flex-1">
        {title && (
          <h5 className="font-semibold mb-1">{title}</h5>
        )}
        {children && (
          <div className="text-sm">{children}</div>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current hover:opacity-70 transition-opacity"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
