'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, Copy, Eye, EyeOff, Trash2, Plus, Check } from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

interface ApiKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
  requests: number
}

export default function ApiKeysPage() {
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({})
  const [copied, setCopied] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')

  const apiKeys: ApiKey[] = [
    {
      id: '1',
      name: 'Production API Key',
      key: 'sk_live_51KxYz2HqF9vE4w2H4K8mN3pQ7rS6tU9vW0xY1zA2bC3dE4fG5hI6jK7lM8nO9pQ',
      created: '2025-10-01',
      lastUsed: '2 hours ago',
      requests: 45234,
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'sk_test_51KxYz2HqF9vE4w2H4K8mN3pQ7rS6tU9vW0xY1zA2bC3dE4fG5hI6jK7lM8nO9pQ',
      created: '2025-09-15',
      lastUsed: '1 day ago',
      requests: 12453,
    },
  ]

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(40) + key.substring(key.length - 4)
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            padding: '32px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}
            >
              API Keys
            </h1>
            <p style={{ fontSize: '16px', color: '#9ca3af' }}>
              Manage your API keys and monitor usage
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              color: 'white',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.2s ease',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Plus style={{ width: '20px', height: '20px' }} />
            Create New Key
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '40px' }}>
        {/* API Keys List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {apiKeys.map((apiKey, index) => (
            <motion.div
              key={apiKey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '24px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Key style={{ width: '24px', height: '24px', color: 'white' }} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '4px',
                      }}
                    >
                      {apiKey.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                      Created {apiKey.created} • Last used {apiKey.lastUsed}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setShowKey({ ...showKey, [apiKey.id]: !showKey[apiKey.id] })}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      e.currentTarget.style.color = '#9ca3af'
                    }}
                  >
                    {showKey[apiKey.id] ? (
                      <EyeOff style={{ width: '18px', height: '18px' }} />
                    ) : (
                      <Eye style={{ width: '18px', height: '18px' }} />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      background:
                        copied === apiKey.id
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${
                        copied === apiKey.id
                          ? 'rgba(16, 185, 129, 0.3)'
                          : 'rgba(255, 255, 255, 0.1)'
                      }`,
                      color: copied === apiKey.id ? '#10b981' : '#9ca3af',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (copied !== apiKey.id) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                        e.currentTarget.style.color = 'white'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (copied !== apiKey.id) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                        e.currentTarget.style.color = '#9ca3af'
                      }
                    }}
                  >
                    {copied === apiKey.id ? (
                      <Check style={{ width: '18px', height: '18px' }} />
                    ) : (
                      <Copy style={{ width: '18px', height: '18px' }} />
                    )}
                  </button>
                  <button
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')
                    }
                  >
                    <Trash2 style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  color: '#10b981',
                  marginBottom: '16px',
                }}
              >
                {showKey[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                    Total Requests
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                    {apiKey.requests.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                    Status
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#10b981',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#10b981',
                      }}
                    />
                    Active
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Usage Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: '32px',
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
        >
          <h2
            style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}
          >
            Usage Overview
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              { label: 'Requests Today', value: '12,453', change: '+23%', positive: true },
              { label: 'Avg Response Time', value: '245ms', change: '-12%', positive: true },
              { label: 'Success Rate', value: '99.8%', change: '+0.2%', positive: true },
              { label: 'Rate Limit', value: '85%', change: '+5%', positive: false },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '4px',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: stat.positive ? '#10b981' : '#ef4444',
                  }}
                >
                  {stat.change} from yesterday
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
