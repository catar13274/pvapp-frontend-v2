import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'
import ProtectedRoute from '@/components/layout/ProtectedRoute'

// Lazy load pages for code splitting and better performance on Raspberry Pi
const Login = React.lazy(() => import('@/pages/Login'))
const Register = React.lazy(() => import('@/pages/Register'))
const Dashboard = React.lazy(() => import('@/pages/Dashboard'))
const Companies = React.lazy(() => import('@/pages/Companies'))
const Materials = React.lazy(() => import('@/pages/Materials'))
const Purchases = React.lazy(() => import('@/pages/Purchases'))
const NotFound = React.lazy(() => import('@/pages/NotFound'))

/**
 * Main App Component
 * Handles routing and layout structure
 */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
              <Login />
            </React.Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
              <Register />
            </React.Suspense>
          }
        />

        {/* Protected Routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={
                <React.Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
                  <Dashboard />
                </React.Suspense>
              }
            />
            <Route
              path="/companies"
              element={
                <React.Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
                  <Companies />
                </React.Suspense>
              }
            />
            <Route
              path="/materials"
              element={
                <React.Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
                  <Materials />
                </React.Suspense>
              }
            />
            <Route
              path="/purchases"
              element={
                <React.Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
                  <Purchases />
                </React.Suspense>
              }
            />
          </Route>
        </Route>

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
              <NotFound />
            </React.Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

/**
 * Main Layout Component
 * Provides consistent layout structure for protected pages
 */
function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <React.Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
              {/* Outlet renders the matched child route */}
              <React.Outlet />
            </React.Suspense>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
