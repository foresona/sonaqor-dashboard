'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Key, Copy, Eye, EyeOff, Trash2, Plus, Check, Filter, X } from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import { getAPIKeysData, type APIKeysData, type APIKey } from '@/data/apiKeys'
import { getProjectsData } from '@/data/projects'

export default function ApiKeysPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const appId = searchParams.get('app')

  const [data, setData] = useState<APIKeysData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({})
  const [copied, setCopied] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')

  // Filter states
  const [apps, setApps] = useState<any[]>([])
  const [selectedAppFilter, setSelectedAppFilter] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await getAPIKeysData()
      setData(result)
      setLoading(false)
    }
    fetchData()
    fetchApps()
  }, [])

  useEffect(() => {
    // Set initial filter from URL param
    if (appId) setSelectedAppFilter(appId)
  }, [appId])

  const fetchApps = async () => {
    const projectsData = await getProjectsData()
    setApps(projectsData.apps)
  }

  const handleClearFilter = () => {
    setSelectedAppFilter('all')
    router.push('/api-keys')
  }

  const handleAppFilterChange = (appId: string) => {
    setSelectedAppFilter(appId)

    if (appId === 'all') {
      router.push('/api-keys')
    } else {
      router.push(`/api-keys?app=${appId}`)
    }
  }

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
          }}
        >
          <div style={{ fontSize: '18px', color: '#9ca3af' }}>Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

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
      <div style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Key style={{ width: '32px', height: '32px', color: '#10b981' }} />
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
                API Keys
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* App Filter */}
              <select
                value={selectedAppFilter}
                onChange={(e) => handleAppFilterChange(e.target.value)}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '200px',
                }}
              >
                <option value="all">All Apps</option>
                {apps.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name} ({app.environment})
                  </option>
                ))}
              </select>

              {/* Clear Filter Button */}
              {selectedAppFilter !== 'all' && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleClearFilter}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                    color: '#ef4444',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <X style={{ width: '16px', height: '16px' }} />
                  Clear
                </motion.button>
              )}

              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #10b981 0%, #a78bfa 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Plus style={{ width: '18px', height: '18px' }} />
                Create API Key
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ color: '#9ca3af', fontSize: '16px' }}>
              Manage your API keys and access tokens • {data.keys.length} active keys
            </p>

            {/* Active Filter Badge */}
            {selectedAppFilter !== 'all' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#3b82f6',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Filter style={{ width: '14px', height: '14px' }} />
                App: {apps.find((a) => a.id === selectedAppFilter)?.name || selectedAppFilter}
              </motion.div>
            )}
          </div>
        </div>

        {/* API Keys List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.keys.map((apiKey, index) => (
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
                      Created {apiKey.createdAt} • Last used {apiKey.lastUsed}
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
                    Requests Today
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                    {apiKey.requestsToday.toLocaleString()}
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
