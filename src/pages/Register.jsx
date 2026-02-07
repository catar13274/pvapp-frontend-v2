import React from 'react'
import { Link } from 'react-router-dom'
import RegisterForm from '@/components/auth/RegisterForm'

/**
 * Register Page
 */

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">PV</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-600 mt-2">Get started with PVApp 2.0</p>
        </div>

        {/* Register Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <RegisterForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
                Sign in
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

export default Register
