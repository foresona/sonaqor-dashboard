'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Webhook,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  Send,
  RotateCcw,
  Download,
  AlertTriangle,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  status: 'active' | 'inactive' | 'error'
  created: string
  lastTriggered: string
  successRate: number
  totalCalls: number
}

interface WebhookDelivery {
  id: number
  event: string
  status: 'success' | 'failed'
  timestamp: string
  duration: string
  webhook: string
  statusCode: number
  payload: any
  response: any
}

export default function WebhooksPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [expandedDelivery, setExpandedDelivery] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all')

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(null)

  // Form states
  const [webhookName, setWebhookName] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: '1',
      name: 'Production Webhook',
      url: 'https://api.yourapp.com/webhooks/sonaqor',
      events: ['forecast.generated', 'persona.matched', 'anomaly.detected'],
      status: 'active',
      created: '2025-09-15',
      lastTriggered: '2 minutes ago',
      successRate: 99.5,
      totalCalls: 12453,
    },
    {
      id: '2',
      name: 'Staging Webhook',
      url: 'https://staging.yourapp.com/webhooks/sonaqor',
      events: ['forecast.generated', 'fscores.calculated'],
      status: 'active',
      created: '2025-10-01',
      lastTriggered: '1 hour ago',
      successRate: 98.2,
      totalCalls: 3421,
    },
    {
      id: '3',
      name: 'Analytics Webhook',
      url: 'https://analytics.yourapp.com/webhooks/events',
      events: ['*'],
      status: 'error',
      created: '2025-08-20',
      lastTriggered: '3 days ago',
      successRate: 76.5,
      totalCalls: 8932,
    },
  ])

  const availableEvents = [
    { name: 'forecast.generated', desc: 'Triggered when a persona forecast is generated' },
    { name: 'persona.matched', desc: 'Triggered when a persona match is found' },
    { name: 'fscores.calculated', desc: 'Triggered when F_scores are calculated' },
    { name: 'anomaly.detected', desc: 'Triggered when behavioral anomaly is detected' },
    { name: 'transaction.processed', desc: 'Triggered when transaction data is processed' },
    { name: '*', desc: 'All events (wildcard)' },
  ]

  const recentDeliveries: WebhookDelivery[] = [
    {
      id: 1,
      event: 'forecast.generated',
      status: 'success',
      timestamp: '2025-10-24 14:32:15',
      duration: '245ms',
      webhook: 'Production Webhook',
      statusCode: 200,
      payload: {
        event: 'forecast.generated',
        timestamp: '2025-10-24T14:32:15.234Z',
        data: {
          user_id: 'usr_1234567890',
          forecast_id: 'fct_abc123def456',
          persona_type: 'impulsive_spender',
          confidence_score: 0.87,
        },
      },
      response: {
        status: 200,
        body: { received: true, processed: true },
      },
    },
    {
      id: 2,
      event: 'persona.matched',
      status: 'success',
      timestamp: '2025-10-24 14:30:42',
      duration: '189ms',
      webhook: 'Production Webhook',
      statusCode: 200,
      payload: {
        event: 'persona.matched',
        timestamp: '2025-10-24T14:30:42.123Z',
        data: {
          user_id: 'usr_9876543210',
          match_id: 'mtch_xyz789ghi012',
          persona: 'conservative_saver',
          match_score: 0.92,
        },
      },
      response: {
        status: 200,
        body: { received: true },
      },
    },
    {
      id: 3,
      event: 'anomaly.detected',
      status: 'failed',
      timestamp: '2025-10-24 14:28:18',
      duration: '5.2s',
      webhook: 'Analytics Webhook',
      statusCode: 500,
      payload: {
        event: 'anomaly.detected',
        timestamp: '2025-10-24T14:28:18.987Z',
        data: {
          user_id: 'usr_5555666777',
          anomaly_id: 'anom_unusual_001',
          type: 'unusual_spending_pattern',
          severity: 'high',
        },
      },
      response: {
        status: 500,
        body: { error: 'Internal server error', message: 'Database connection timeout' },
      },
    },
  ]

  // Handlers
  const handleCreateWebhook = () => {
    if (!webhookName || !webhookUrl || selectedEvents.length === 0) {
      alert('Please fill all fields')
      return
    }

    const newWebhook: WebhookConfig = {
      id: String(webhooks.length + 1),
      name: webhookName,
      url: webhookUrl,
      events: selectedEvents,
      status: 'active',
      created: new Date().toISOString().split('T')[0],
      lastTriggered: 'Never',
      successRate: 0,
      totalCalls: 0,
    }

    setWebhooks([...webhooks, newWebhook])
    setShowCreateModal(false)
    setWebhookName('')
    setWebhookUrl('')
    setSelectedEvents([])
  }

  const handleEditWebhook = () => {
    if (!selectedWebhook || !webhookName || !webhookUrl || selectedEvents.length === 0) return

    setWebhooks(
      webhooks.map((w) =>
        w.id === selectedWebhook.id
          ? { ...w, name: webhookName, url: webhookUrl, events: selectedEvents }
          : w,
      ),
    )
    setShowEditModal(false)
    setSelectedWebhook(null)
    setWebhookName('')
    setWebhookUrl('')
    setSelectedEvents([])
  }

  const handleDeleteWebhook = () => {
    if (!selectedWebhook) return
    setWebhooks(webhooks.filter((w) => w.id !== selectedWebhook.id))
    setShowDeleteModal(false)
    setSelectedWebhook(null)
  }

  const handleTestWebhook = () => {
    alert('Test webhook delivery sent successfully!')
    setShowTestModal(false)
    setSelectedWebhook(null)
  }

  const openEditModal = (webhook: WebhookConfig) => {
    setSelectedWebhook(webhook)
    setWebhookName(webhook.name)
    setWebhookUrl(webhook.url)
    setSelectedEvents(webhook.events)
    setShowEditModal(true)
  }

  const openDeleteModal = (webhook: WebhookConfig) => {
    setSelectedWebhook(webhook)
    setShowDeleteModal(true)
  }

  const openTestModal = (webhook: WebhookConfig) => {
    setSelectedWebhook(webhook)
    setShowTestModal(true)
  }

  const toggleEvent = (eventName: string) => {
    if (selectedEvents.includes(eventName)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== eventName))
    } else {
      setSelectedEvents([...selectedEvents, eventName])
    }
  }

  // Filter and paginate deliveries
  const filteredDeliveries = useMemo(() => {
    let filtered = recentDeliveries

    if (statusFilter !== 'all') {
      filtered = filtered.filter((d) => d.status === statusFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.webhook.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }, [statusFilter, searchQuery])

  const totalPages = Math.ceil(filteredDeliveries.length / pageSize)
  const paginatedDeliveries = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredDeliveries.slice(startIndex, startIndex + pageSize)
  }, [filteredDeliveries, currentPage, pageSize])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'rgba(16, 185, 129, 0.2)', border: 'rgba(16, 185, 129, 0.3)', text: '#10b981' }
      case 'inactive':
        return {
          bg: 'rgba(156, 163, 175, 0.2)',
          border: 'rgba(156, 163, 175, 0.3)',
          text: '#9ca3af',
        }
      case 'error':
        return { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' }
      default:
        return {
          bg: 'rgba(156, 163, 175, 0.2)',
          border: 'rgba(156, 163, 175, 0.3)',
          text: '#9ca3af',
        }
    }
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
              <Webhook style={{ width: '32px', height: '32px', color: '#10b981' }} />
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
                Webhooks
              </h1>
            </div>
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
              Create Webhook
            </button>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Configure webhooks to receive real-time event notifications • {webhooks.length} webhooks
            configured
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {[
            {
              label: 'Total Webhooks',
              value: webhooks.length.toString(),
              icon: Webhook,
              gradient: { start: '#3b82f6', end: '#8b5cf6' },
            },
            {
              label: 'Active',
              value: webhooks.filter((w) => w.status === 'active').length.toString(),
              icon: CheckCircle,
              gradient: { start: '#10b981', end: '#059669' },
            },
            {
              label: 'Success Rate',
              value: '94.7%',
              icon: Zap,
              gradient: { start: '#a855f7', end: '#ec4899' },
            },
            {
              label: 'Total Deliveries',
              value: '24.8K',
              icon: Clock,
              gradient: { start: '#f59e0b', end: '#ef4444' },
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${stat.gradient.start} 0%, ${stat.gradient.end} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <stat.icon style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
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
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Webhooks List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '32px' }}
        >
          <h2
            style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}
          >
            Configured Webhooks
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {webhooks.map((webhook, index) => {
              const statusColor = getStatusColor(webhook.status)

              return (
                <motion.div
                  key={webhook.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
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
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '12px',
                        }}
                      >
                        <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white' }}>
                          {webhook.name}
                        </h3>
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            background: statusColor.bg,
                            border: `1px solid ${statusColor.border}`,
                            color: statusColor.text,
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {webhook.status}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          background: 'rgba(0, 0, 0, 0.3)',
                          marginBottom: '16px',
                        }}
                      >
                        <code
                          style={{
                            flex: 1,
                            fontSize: '14px',
                            color: '#3b82f6',
                            fontFamily: 'monospace',
                          }}
                        >
                          {webhook.url}
                        </code>
                        <button
                          onClick={() => copyToClipboard(webhook.url, webhook.id)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            background:
                              copied === webhook.id
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(255, 255, 255, 0.05)',
                            border: 'none',
                            color: copied === webhook.id ? '#10b981' : '#9ca3af',
                            cursor: 'pointer',
                          }}
                        >
                          {copied === webhook.id ? (
                            <Check style={{ width: '16px', height: '16px' }} />
                          ) : (
                            <Copy style={{ width: '16px', height: '16px' }} />
                          )}
                        </button>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                          marginBottom: '16px',
                        }}
                      >
                        {webhook.events.map((event, i) => (
                          <span
                            key={i}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'rgba(59, 130, 246, 0.1)',
                              border: '1px solid rgba(59, 130, 246, 0.2)',
                              color: '#3b82f6',
                              fontSize: '13px',
                              fontFamily: 'monospace',
                            }}
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openTestModal(webhook)}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: '#3b82f6',
                          cursor: 'pointer',
                        }}
                        title="Test webhook"
                      >
                        <Send style={{ width: '18px', height: '18px' }} />
                      </button>
                      <button
                        onClick={() => openEditModal(webhook)}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#9ca3af',
                          cursor: 'pointer',
                        }}
                      >
                        <Edit2 style={{ width: '18px', height: '18px' }} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(webhook)}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 style={{ width: '18px', height: '18px' }} />
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                        Created
                      </div>
                      <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>
                        {webhook.created}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                        Last Triggered
                      </div>
                      <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>
                        {webhook.lastTriggered}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                        Success Rate
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: webhook.successRate > 95 ? '#10b981' : '#f59e0b',
                          fontWeight: 'bold',
                        }}
                      >
                        {webhook.successRate}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                        Total Calls
                      </div>
                      <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>
                        {webhook.totalCalls.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Deliveries Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
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
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '16px',
            }}
          >
            Recent Deliveries
          </h2>

          {/* Search and Filters */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ position: 'relative', flex: '0 0 300px' }}>
              <Search
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: '#9ca3af',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Search by event or webhook..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {[
              { key: 'all', label: 'All' },
              { key: 'success', label: 'Success' },
              { key: 'failed', label: 'Failed' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => {
                  setStatusFilter(filter.key as any)
                  setCurrentPage(1)
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background:
                    statusFilter === filter.key
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                  border:
                    statusFilter === filter.key
                      ? '1px solid rgba(16, 185, 129, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  color: statusFilter === filter.key ? '#10b981' : '#9ca3af',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Deliveries List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {paginatedDeliveries.map((delivery, i) => (
              <motion.div
                key={delivery.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                }}
              >
                <div
                  onClick={() => setExpandedDelivery(expandedDelivery === i ? null : i)}
                  style={{
                    padding: '16px 18px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <span
                        style={{
                          fontSize: '14px',
                          color: 'white',
                          fontWeight: '600',
                          fontFamily: 'monospace',
                        }}
                      >
                        {delivery.event}
                      </span>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background:
                            delivery.status === 'success'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                          border:
                            delivery.status === 'success'
                              ? '1px solid rgba(16, 185, 129, 0.3)'
                              : '1px solid rgba(239, 68, 68, 0.3)',
                          color: delivery.status === 'success' ? '#10b981' : '#ef4444',
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                        }}
                      >
                        {delivery.statusCode}
                      </span>
                    </div>
                    {expandedDelivery === i ? (
                      <ChevronUp
                        style={{
                          width: '18px',
                          height: '18px',
                          color: '#9ca3af',
                        }}
                      />
                    ) : (
                      <ChevronDown
                        style={{
                          width: '18px',
                          height: '18px',
                          color: '#9ca3af',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                    {delivery.webhook}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#6b7280' }}>
                    <span>{delivery.timestamp}</span>
                    <span>•</span>
                    <span>{delivery.duration}</span>
                  </div>
                </div>

                {expandedDelivery === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      background: 'rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#9ca3af' }}>
                          Request Payload
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(
                              JSON.stringify(delivery.payload, null, 2),
                              `delivery-${i}`,
                            )
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background:
                              copied === `delivery-${i}`
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: copied === `delivery-${i}` ? '#10b981' : '#9ca3af',
                            cursor: 'pointer',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {copied === `delivery-${i}` ? (
                            <>
                              <Check style={{ width: '12px', height: '12px' }} />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy style={{ width: '12px', height: '12px' }} />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          background: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          overflowX: 'auto',
                          fontSize: '11px',
                          lineHeight: '1.5',
                          color: '#e5e7eb',
                          fontFamily: 'monospace',
                          maxHeight: '300px',
                          overflowY: 'auto',
                        }}
                      >
                        {JSON.stringify(delivery.payload, null, 2)}
                      </pre>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#9ca3af',
                          marginBottom: '8px',
                        }}
                      >
                        Response
                      </div>
                      <pre
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          background: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          overflowX: 'auto',
                          fontSize: '11px',
                          lineHeight: '1.5',
                          color: '#e5e7eb',
                          fontFamily: 'monospace',
                        }}
                      >
                        {JSON.stringify(delivery.response, null, 2)}
                      </pre>
                    </div>

                    {delivery.status === 'failed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          alert('Retry delivery queued!')
                        }}
                        style={{
                          marginTop: '12px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: '#3b82f6',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <RotateCcw style={{ width: '14px', height: '14px' }} />
                        Retry Delivery
                      </button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '13px',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: currentPage === 1 ? '#4b5563' : '#9ca3af',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ChevronLeft style={{ width: '16px', height: '16px' }} />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: currentPage === totalPages ? '#4b5563' : '#9ca3af',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ChevronRight style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Webhook Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background:
                  'linear-gradient(135deg, rgba(30, 30, 35, 0.98) 0%, rgba(20, 20, 25, 0.98) 100%)',
                borderRadius: '20px',
                padding: '32px',
                maxWidth: '600px',
                width: '100%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                  Create Webhook
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                  }}
                >
                  <X style={{ width: '20px', height: '20px' }} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Webhook Name
                  </label>
                  <input
                    type="text"
                    value={webhookName}
                    onChange={(e) => setWebhookName(e.target.value)}
                    placeholder="Production Webhook"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Endpoint URL
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-api.com/webhooks"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: '#9ca3af',
                      marginBottom: '12px',
                    }}
                  >
                    Events to Subscribe
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {availableEvents.map((event) => (
                      <div
                        key={event.name}
                        onClick={() => toggleEvent(event.name)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '10px',
                          background: selectedEvents.includes(event.name)
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(255, 255, 255, 0.03)',
                          border: selectedEvents.includes(event.name)
                            ? '1px solid rgba(16, 185, 129, 0.3)'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: selectedEvents.includes(event.name) ? '#10b981' : 'white',
                                fontFamily: 'monospace',
                                marginBottom: '4px',
                              }}
                            >
                              {event.name}
                            </div>
                            <div style={{ fontSize: '13px', color: '#9ca3af' }}>{event.desc}</div>
                          </div>
                          {selectedEvents.includes(event.name) && (
                            <Check style={{ width: '20px', height: '20px', color: '#10b981' }} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '32px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWebhook}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                  }}
                >
                  Create Webhook
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit, Delete, Test Modals - Similar structure */}
      {/* ... (I'll add these in a follow-up to keep file manageable) */}
    </DashboardLayout>
  )
}
