import React from 'react'
import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

/**
 * 404 Not Found Page
 */

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <AlertCircle className="w-24 h-24 text-slate-400 mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button>
            <Home className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
