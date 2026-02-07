import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Input Component
 * Text input with consistent styling
 */

export const Input = React.forwardRef(({
  className,
  type = 'text',
  error,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2',
        'text-base text-slate-900 placeholder:text-slate-400',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
        'transition-colors duration-200',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input'

/**
 * Textarea Component
 */
export const Textarea = React.forwardRef(({
  className,
  error,
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2',
        'text-base text-slate-900 placeholder:text-slate-400',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
        'transition-colors duration-200',
        'min-h-[100px] resize-y',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'
