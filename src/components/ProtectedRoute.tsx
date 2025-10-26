'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const spinKeyframes = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore()
  const [isChecking, setIsChecking] = useState(false) // Start as false to avoid flash

  useEffect(() => {
    const verifyAuth = async () => {
      // Only show checking if we're not already authenticated (from cache)
      if (!isAuthenticated) {
        setIsChecking(true)
      }
      await checkAuth()
      setIsChecking(false)
    }
    verifyAuth()
  }, [checkAuth, isAuthenticated])

  useEffect(() => {
    // Don't redirect if still checking or on login page
    if (isChecking || pathname === '/login') return

    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isChecking, router, pathname])

  // Show minimal loading only on first check, then show layout with content loading
  if (isChecking) {
    return (
      <>
        <style>{spinKeyframes}</style>
        <div
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 16px',
                border: '3px solid rgba(16, 185, 129, 0.2)',
                borderTopColor: '#10b981',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          </div>
        </div>
      </>
    )
  }

  // Don't render children if not authenticated
  if (!isAuthenticated && pathname !== '/login') {
    return null
  }

  return <>{children}</>
}
