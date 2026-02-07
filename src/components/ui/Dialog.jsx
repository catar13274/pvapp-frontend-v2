import React from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

/**
 * Dialog Component
 * Modal dialog with overlay
 */

export const Dialog = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog Content */}
      <div className="relative z-50 w-full max-w-lg mx-4 animate-slide-in-from-bottom">
        {children}
      </div>
    </div>
  )
}

export const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden',
        'flex flex-col',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

DialogContent.displayName = 'DialogContent'

export const DialogHeader = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-slate-200 flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const DialogTitle = ({ className, children, ...props }) => {
  return (
    <h2
      className={cn('text-xl font-semibold text-slate-900', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

export const DialogDescription = ({ className, children, ...props }) => {
  return (
    <p
      className={cn('text-sm text-slate-600 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export const DialogBody = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('px-6 py-4 overflow-y-auto custom-scrollbar', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const DialogFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-slate-200 bg-slate-50',
        'flex items-center justify-end gap-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const DialogClose = ({ onClose }) => {
  return (
    <button
      onClick={onClose}
      className="text-slate-400 hover:text-slate-600 transition-colors"
      aria-label="Close dialog"
    >
      <X className="w-5 h-5" />
    </button>
  )
}
