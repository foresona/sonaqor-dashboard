'use client'

import React, { useState, useEffect, Suspense, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Check,
  Filter,
  X,
  ArrowUpDown,
  Layers,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import CustomSelect from '@/components/CustomSelect'
import SkeletonCard from '@/components/SkeletonCard'
import { getAPIKeysData, type APIKeysData, type APIKey } from '@/data/apiKeys'
import { getProjectsData } from '@/data/projects'

function ApiKeysContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const appId = searchParams.get('app')

  const [data, setData] = useState<APIKeysData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({})
  const [copied, setCopied] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyApp, setNewKeyApp] = useState('')
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<'Production' | 'Staging' | 'Development'>('Production')

  // Filter states
  const [apps, setApps] = useState<any[]>([])
  const [selectedAppFilter, setSelectedAppFilter] = useState<string>('all')
  const [selectedEnvFilter, setSelectedEnvFilter] = useState<string>('all')

  // Sorting and grouping states
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'lastUsed' | 'status'>('created')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [groupBy, setGroupBy] = useState<'none' | 'app' | 'status'>('none')

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

  // Sorting and grouping logic
  const processedKeys = useMemo(() => {
    if (!data) return []

    // Filter by app
    let filtered =
      selectedAppFilter === 'all'
        ? data.keys
        : data.keys.filter((key) => key.app === selectedAppFilter)

    // Filter by environment
    if (selectedEnvFilter !== 'all') {
      filtered = filtered.filter((key) => key.environment === selectedEnvFilter)
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'lastUsed':
          const aTime = a.lastUsed ? new Date(a.lastUsed).getTime() : 0
          const bTime = b.lastUsed ? new Date(b.lastUsed).getTime() : 0
          comparison = aTime - bTime
          break
        case 'status':
          const statusOrder = { Active: 1, Revoked: 2 }
          comparison = statusOrder[a.status] - statusOrder[b.status]
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    // Group
    if (groupBy === 'none') {
      return [{ title: null, keys: sorted }]
    } else if (groupBy === 'app') {
      const grouped = sorted.reduce((acc, key) => {
        const group = acc.find((g) => g.title === key.app)
        if (group) {
          group.keys.push(key)
        } else {
          acc.push({ title: key.app || null, keys: [key] })
        }
        return acc
      }, [] as Array<{ title: string | null; keys: APIKey[] }>)
      return grouped
    } else if (groupBy === 'status') {
      const grouped = sorted.reduce((acc, key) => {
        const group = acc.find((g) => g.title === key.status)
        if (group) {
          group.keys.push(key)
        } else {
          acc.push({ title: key.status, keys: [key] })
        }
        return acc
      }, [] as Array<{ title: string | null; keys: APIKey[] }>)
      return grouped
    }

    return [{ title: null, keys: sorted }]
  }, [data, selectedAppFilter, selectedEnvFilter, sortBy, sortOrder, groupBy])

  // Get unique environments
  const uniqueEnvironments = useMemo(() => {
    if (!data) return []
    return Array.from(new Set(data.keys.map((key) => key.environment)))
  }, [data])

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
              marginBottom: '16px',
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

            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Plus style={{ width: '18px', height: '18px' }} />
              Create API Key
            </button>
          </div>

          {/* Controls Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {/* App Filter */}
            <CustomSelect
              value={selectedAppFilter}
              onChange={(value) => handleAppFilterChange(value)}
              options={[
                { value: 'all', label: 'All Apps' },
                ...apps.map((app) => ({
                  value: app.id,
                  label: `${app.name} (${app.environment})`,
                })),
              ]}
              accentColor="#10b981"
              minWidth="180px"
            />

            {/* Environment Filter */}
            <CustomSelect
              value={selectedEnvFilter}
              onChange={(value) => setSelectedEnvFilter(value)}
              options={[
                { value: 'all', label: 'All Environments' },
                ...uniqueEnvironments.map((env) => ({ value: env, label: env })),
              ]}
              accentColor="#10b981"
              minWidth="180px"
            />

            {/* Sort By */}
            <CustomSelect
              value={sortBy}
              onChange={(value) => setSortBy(value as any)}
              options={[
                { value: 'created', label: 'Created Date' },
                { value: 'name', label: 'Name' },
                { value: 'lastUsed', label: 'Last Used' },
                { value: 'status', label: 'Status' },
              ]}
              accentColor="#10b981"
              minWidth="180px"
            />

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{
                padding: '12px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: sortOrder === 'desc' ? '#10b981' : '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
              }}
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
            >
              <ArrowUpDown style={{ width: '18px', height: '18px' }} />
            </button>

            {/* Clear Filter Button */}
            {(selectedAppFilter !== 'all' || selectedEnvFilter !== 'all') && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => {
                  setSelectedAppFilter('all')
                  setSelectedEnvFilter('all')
                  handleClearFilter()
                }}
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
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
              >
                <X style={{ width: '16px', height: '16px' }} />
                Clear Filters
              </motion.button>
            )}
          </div>
        </div>

        {/* Usage Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            marginBottom: '32px',
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

        {/* API Keys Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
            gap: '20px',
          }}
        >
          {loading ? (
            <SkeletonCard variant="apiKey" count={3} />
          ) : (
            processedKeys.length > 0 &&
            processedKeys[0].keys.map((apiKey, index) => {
              const envColor =
                apiKey.environment === 'Production'
                  ? {
                      bg: 'rgba(16, 185, 129, 0.1)',
                      border: 'rgba(16, 185, 129, 0.3)',
                      text: '#10b981',
                    }
                  : apiKey.environment === 'Staging'
                  ? {
                      bg: 'rgba(245, 158, 11, 0.1)',
                      border: 'rgba(245, 158, 11, 0.3)',
                      text: '#f59e0b',
                    }
                  : {
                      bg: 'rgba(139, 92, 246, 0.1)',
                      border: 'rgba(139, 92, 246, 0.3)',
                      text: '#8b5cf6',
                    }

              return (
                <motion.div
                  key={apiKey.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 + index * 0.03 }}
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '20px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    transition: 'transform 0.2s, border-color 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '8px',
                        }}
                      >
                        {apiKey.name}
                      </h3>
                      {/* App and Environment Tags */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            color: '#3b82f6',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {apiKey.appName || 'Unknown App'}
                        </span>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: envColor.bg,
                            border: `1px solid ${envColor.border}`,
                            color: envColor.text,
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {apiKey.environment}
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background:
                          apiKey.status === 'Active'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${
                          apiKey.status === 'Active'
                            ? 'rgba(16, 185, 129, 0.3)'
                            : 'rgba(239, 68, 68, 0.3)'
                        }`,
                        color: apiKey.status === 'Active' ? '#10b981' : '#ef4444',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}
                    >
                      {apiKey.status}
                    </span>
                  </div>

                  {/* API Key */}
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      marginBottom: '12px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      color: '#3b82f6',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      position: 'relative',
                    }}
                  >
                    {showKey[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                  </div>

                  {/* Stats */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '12px',
                      marginBottom: '16px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                        Requests Today
                      </div>
                      <div style={{ fontSize: '18px', color: '#10b981', fontWeight: 'bold' }}>
                        {apiKey.requestsToday.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                        Last Used
                      </div>
                      <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>
                        {apiKey.lastUsed}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowKey({ ...showKey, [apiKey.id]: !showKey[apiKey.id] })
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#3b82f6',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      {showKey[apiKey.id] ? (
                        <>
                          <EyeOff style={{ width: '14px', height: '14px' }} />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye style={{ width: '14px', height: '14px' }} />
                          Show
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(apiKey.key, apiKey.id)
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background:
                          copied === apiKey.id
                            ? 'rgba(16, 185, 129, 0.2)'
                            : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${
                          copied === apiKey.id
                            ? 'rgba(16, 185, 129, 0.3)'
                            : 'rgba(255, 255, 255, 0.1)'
                        }`,
                        color: copied === apiKey.id ? '#10b981' : 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      {copied === apiKey.id ? (
                        <>
                          <Check style={{ width: '14px', height: '14px' }} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy style={{ width: '14px', height: '14px' }} />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle delete
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Create API Key Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
              }}
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '32px',
                  maxWidth: '500px',
                  width: '100%',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                }}
              >
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '24px',
                  }}
                >
                  Create New API Key
                </h2>

                {/* Key Name */}
                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API Key"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* App Selection */}
                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Application
                  </label>
                  <CustomSelect
                    value={newKeyApp}
                    onChange={(value) => setNewKeyApp(value)}
                    options={[
                      { value: '', label: 'Select an application' },
                      ...apps.map((app) => ({ value: app.id, label: app.name })),
                    ]}
                    placeholder="Select an application"
                    accentColor="#10b981"
                    minWidth="100%"
                  />
                </div>

                {/* Environment Selection */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Environment
                  </label>
                  <CustomSelect
                    value={newKeyEnvironment}
                    onChange={(value) => setNewKeyEnvironment(value as 'Production' | 'Staging' | 'Development')}
                    options={[
                      { value: 'Production', label: 'Production' },
                      { value: 'Staging', label: 'Staging' },
                      { value: 'Development', label: 'Development' },
                    ]}
                    accentColor="#10b981"
                    minWidth="100%"
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      setNewKeyName('')
                      setNewKeyApp('')
                      setNewKeyEnvironment('Production')
                    }}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newKeyName.trim() && newKeyApp) {
                        // TODO: Implement API key creation
                        console.log('Creating API key:', {
                          name: newKeyName,
                          app: newKeyApp,
                          environment: newKeyEnvironment,
                        })
                        setShowCreateModal(false)
                        setNewKeyName('')
                        setNewKeyApp('')
                        setNewKeyEnvironment('Production')
                      }
                    }}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: newKeyName.trim() && newKeyApp ? 'pointer' : 'not-allowed',
                      opacity: newKeyName.trim() && newKeyApp ? 1 : 0.5,
                    }}
                    disabled={!newKeyName.trim() || !newKeyApp}
                  >
                    Create Key
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}

export default function ApiKeysPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
        </DashboardLayout>
      }
    >
      <ApiKeysContent />
    </Suspense>
  )
}
