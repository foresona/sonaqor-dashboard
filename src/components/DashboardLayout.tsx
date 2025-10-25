'use client'

import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import AnimatedBackground from './AnimatedBackground'
import ProtectedRoute from './ProtectedRoute'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div
        style={{ display: 'flex', minHeight: '100vh', background: '#000000', position: 'relative' }}
      >
        <AnimatedBackground />
        <Sidebar />
        <main
          style={{
            marginLeft: '280px',
            flex: 1,
            position: 'relative',
            zIndex: 1,
            transition: 'margin-left 0.3s ease',
          }}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
