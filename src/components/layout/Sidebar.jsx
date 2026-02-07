import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  ShoppingCart, 
  X 
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Sidebar Component
 * Side navigation menu
 */

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Companies',
    href: '/companies',
    icon: Building2,
  },
  {
    name: 'Materials',
    href: '/materials',
    icon: Package,
  },
  {
    name: 'Purchases',
    href: '/purchases',
    icon: ShoppingCart,
  },
]

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen',
          'w-64 bg-white border-r border-slate-200',
          'transform transition-transform duration-200 ease-in-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 lg:hidden">
          <span className="text-lg font-semibold text-slate-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => onClose()}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg',
                  'text-sm font-medium transition-colors',
                  'touch-target', // Touch-friendly for tablets
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-700 hover:bg-slate-100'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            PVApp 2.0
            <br />
            Version 2.0.0
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
