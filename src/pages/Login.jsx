import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '@/components/auth/LoginForm'

/**
 * Login Page
 */

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">PV</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-600 mt-2">Sign in to your PVApp account</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <LoginForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-8">
          PVApp 2.0 - Materials Management System
        </p>
      </div>
    </div>
  )
}

export default Login
