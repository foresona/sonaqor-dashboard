'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { FileBarChart } from 'lucide-react'

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <FileBarChart style={{ width: '32px', height: '32px', color: '#10b981' }} />
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #10b981, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Reports & Exports
            </h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Generate reports and schedule automated exports
          </p>
        </div>

        {/* Coming Soon Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '60px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #10b981 0%, #a78bfa 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <FileBarChart style={{ width: '40px', height: '40px', color: 'white' }} />
          </div>
          <h2
            style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}
          >
            Coming Soon
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
            Reports & Exports module is under development. You'll be able to generate custom
            reports, export in multiple formats (CSV, Excel, PDF), and schedule automated delivery.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
