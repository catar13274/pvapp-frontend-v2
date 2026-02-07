import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Badge Component
 * Small label for status, tags, or counts
 */

const badgeVariants = {
  default: 'bg-slate-100 text-slate-800',
  primary: 'bg-primary-100 text-primary-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
}

export const Badge = React.forwardRef(({
  className,
  variant = 'default',
  children,
  ...props
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'
