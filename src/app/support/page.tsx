'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { HelpCircle } from 'lucide-react'

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <HelpCircle style={{ width: '32px', height: '32px', color: '#10b981' }} />
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
              Help & Support
            </h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Get help, browse documentation, and submit support tickets
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
            <HelpCircle style={{ width: '40px', height: '40px', color: 'white' }} />
          </div>
          <h2
            style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}
          >
            Coming Soon
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
            Help & Support center is under development. You'll access the knowledge base, submit
            tickets, use live chat, and find training resources and API documentation.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
