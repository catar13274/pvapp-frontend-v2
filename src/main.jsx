import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

/**
 * React Query Configuration
 * Optimized for Raspberry Pi performance
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes to reduce API calls
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Don't refetch on window focus to save resources
      refetchOnWindowFocus: false,
      // Retry failed requests only once
      retry: 1,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
})

/**
 * Root Component
 * Wraps the app with necessary providers
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
