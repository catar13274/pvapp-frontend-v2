import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Select, SelectOption } from '@/components/ui/Select'
import useAuthStore from '@/store/authStore'
import useCompanyStore from '@/store/companyStore'
import { useLogout } from '@/hooks/useAuth'
import { getInitials } from '@/lib/utils'

/**
 * Header Component
 * Top navigation bar with company selector and user menu
 */

const Header = ({ onMenuClick }) => {
  const { user } = useAuthStore()
  const { selectedCompany, companies, selectCompany } = useCompanyStore()
  const logout = useLogout()
  const [showUserMenu, setShowUserMenu] = React.useState(false)

  const handleLogout = () => {
    logout.mutate()
  }

  const handleCompanyChange = (e) => {
    const companyId = parseInt(e.target.value)
    const company = companies.find((c) => c.id === companyId)
    if (company) {
      selectCompany(company)
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">PV</span>
            </div>
            <span className="hidden sm:block text-xl font-bold text-slate-900">
              PVApp 2.0
            </span>
          </Link>

          {/* Company Selector */}
          <div className="flex-1 max-w-xs mx-4">
            {companies.length > 0 && (
              <Select
                value={selectedCompany?.id || ''}
                onChange={handleCompanyChange}
              >
                <SelectOption value="" disabled>
                  Select Company
                </SelectOption>
                {companies.map((company) => (
                  <SelectOption key={company.id} value={company.id}>
                    {company.name}
                  </SelectOption>
                ))}
              </Select>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Avatar
                fallback={getInitials(user?.name || user?.email || 'U')}
                size="sm"
              />
              <span className="hidden sm:block text-sm font-medium text-slate-700">
                {user?.name || user?.email}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
