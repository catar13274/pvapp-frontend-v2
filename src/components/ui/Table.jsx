import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Table Components
 * Responsive table with consistent styling
 */

export const Table = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="w-full overflow-auto custom-scrollbar">
      <table
        ref={ref}
        className={cn('w-full border-collapse', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
})

Table.displayName = 'Table'

export const TableHeader = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <thead
      ref={ref}
      className={cn('bg-slate-50 border-b border-slate-200', className)}
      {...props}
    >
      {children}
    </thead>
  )
})

TableHeader.displayName = 'TableHeader'

export const TableBody = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <tbody
      ref={ref}
      className={cn('divide-y divide-slate-200', className)}
      {...props}
    >
      {children}
    </tbody>
  )
})

TableBody.displayName = 'TableBody'

export const TableRow = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <tr
      ref={ref}
      className={cn('hover:bg-slate-50 transition-colors', className)}
      {...props}
    >
      {children}
    </tr>
  )
})

TableRow.displayName = 'TableRow'

export const TableHead = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <th
      ref={ref}
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
})

TableHead.displayName = 'TableHead'

export const TableCell = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <td
      ref={ref}
      className={cn('px-4 py-3 text-sm text-slate-900', className)}
      {...props}
    >
      {children}
    </td>
  )
})

TableCell.displayName = 'TableCell'

/**
 * Empty State for Tables
 */
export const TableEmpty = ({ colSpan, message = 'No data available' }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8 text-slate-500">
        {message}
      </TableCell>
    </TableRow>
  )
}
