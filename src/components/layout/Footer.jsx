import React from 'react'

/**
 * Footer Component
 * Application footer with copyright info
 */

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const companyName = import.meta.env.VITE_COMPANY_NAME || 'Your Company'

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-slate-600">
            © {currentYear} {companyName}. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Built with React + Vite + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
