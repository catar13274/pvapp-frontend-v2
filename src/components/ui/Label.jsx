import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Label Component
 * Form label with consistent styling
 */

export const Label = React.forwardRef(({
  className,
  children,
  required = false,
  ...props
}, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'block text-sm font-medium text-slate-700 mb-1',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
})

Label.displayName = 'Label'

/**
 * FormGroup Component
 * Wrapper for form field with label and error
 */
export const FormGroup = ({ label, error, children, required, className }) => {
  return (
    <div className={cn('mb-4', className)}>
      {label && <Label required={required}>{label}</Label>}
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}
