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
  FileText,
  Filter,
  X,
  Send,
  RotateCcw,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import CustomSelect from '@/components/CustomSelect'

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
  headers?: Record<string, string>
}

export default function WebhooksPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [retrying, setRetrying] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [expandedDelivery, setExpandedDelivery] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all')

  // Tab state
  const [activeTab, setActiveTab] = useState<'configuration' | 'logs' | 'events' | 'examples'>('configuration')

  // Webhook filtering
  const [webhookSearchQuery, setWebhookSearchQuery] = useState('')
  const [webhookStatusFilter, setWebhookStatusFilter] = useState<
    'all' | 'active' | 'inactive' | 'error'
  >('all')

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
  const [webhookHeaders, setWebhookHeaders] = useState<Array<{ key: string; value: string }>>([])

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
      headers: {
        Authorization: 'Bearer sk_live_prod_xxx...',
        'Content-Type': 'application/json',
        'X-API-Version': 'v2',
      },
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
      headers: {
        'X-API-Key': 'staging_key_abc123...',
        'Content-Type': 'application/json',
      },
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

  // Handler functions
  const handleCreateWebhook = () => {
    if (!webhookName || !webhookUrl || selectedEvents.length === 0) {
      alert('Please fill all required fields')
      return
    }

    const headers: Record<string, string> = {}
    webhookHeaders.forEach(({ key, value }) => {
      if (key && value) headers[key] = value
    })

    const newWebhook: WebhookConfig = {
      id: String(Date.now()),
      name: webhookName,
      url: webhookUrl,
      events: selectedEvents,
      status: 'active',
      created: new Date().toISOString().split('T')[0],
      lastTriggered: 'Never',
      successRate: 100,
      totalCalls: 0,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    }

    setWebhooks([...webhooks, newWebhook])
    setShowCreateModal(false)
    setWebhookName('')
    setWebhookUrl('')
    setSelectedEvents([])
    setWebhookHeaders([])
  }

  const handleEditWebhook = () => {
    if (!selectedWebhook || !webhookName || !webhookUrl || selectedEvents.length === 0) return

    const headers: Record<string, string> = {}
    webhookHeaders.forEach(({ key, value }) => {
      if (key && value) headers[key] = value
    })

    setWebhooks(
      webhooks.map((w) =>
        w.id === selectedWebhook.id
          ? {
              ...w,
              name: webhookName,
              url: webhookUrl,
              events: selectedEvents,
              headers: Object.keys(headers).length > 0 ? headers : undefined,
            }
          : w,
      ),
    )
    setShowEditModal(false)
    setSelectedWebhook(null)
    setWebhookName('')
    setWebhookUrl('')
    setSelectedEvents([])
    setWebhookHeaders([])
  }

  const handleDeleteWebhook = () => {
    if (!selectedWebhook) return
    setWebhooks(webhooks.filter((w) => w.id !== selectedWebhook.id))
    setShowDeleteModal(false)
    setSelectedWebhook(null)
  }

  const handleTestWebhook = () => {
    alert(`Test webhook delivery sent to ${selectedWebhook?.name}!`)
    setShowTestModal(false)
    setSelectedWebhook(null)
  }

  const openEditModal = (webhook: WebhookConfig) => {
    setSelectedWebhook(webhook)
    setWebhookName(webhook.name)
    setWebhookUrl(webhook.url)
    setSelectedEvents(webhook.events)
    setWebhookHeaders(
      webhook.headers
        ? Object.entries(webhook.headers).map(([key, value]) => ({ key, value }))
        : [],
    )
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

  const recentDeliveries = [
    {
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
          predicted_behavior: {
            spending_pattern: 'high_frequency',
            risk_level: 'medium',
            next_purchase_window: '3-5 days',
          },
          f_scores: {
            financial_stability: 0.72,
            spending_consistency: 0.65,
            debt_management: 0.81,
          },
        },
      },
      response: {
        status: 200,
        body: { received: true, processed: true },
      },
    },
    {
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
          characteristics: {
            saving_rate: 'high',
            investment_preference: 'low_risk',
            spending_discipline: 'high',
          },
          recommendations: ['Fixed deposit accounts', 'Government bonds', 'Savings goals tracker'],
        },
      },
      response: {
        status: 200,
        body: { received: true },
      },
    },
    {
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
          details: {
            transaction_amount: 25000,
            average_transaction: 1500,
            deviation_percentage: 1567,
            location: 'Lagos, Nigeria',
            merchant_category: 'Electronics',
          },
          risk_indicators: [
            'Amount 15x higher than average',
            'First-time merchant',
            'Unusual time of transaction',
          ],
        },
      },
      response: {
        status: 500,
        body: { error: 'Internal server error', message: 'Database connection timeout' },
      },
    },
    {
      event: 'fscores.calculated',
      status: 'success',
      timestamp: '2025-10-24 14:25:33',
      duration: '312ms',
      webhook: 'Staging Webhook',
      statusCode: 201,
      payload: {
        event: 'fscores.calculated',
        timestamp: '2025-10-24T14:25:33.456Z',
        data: {
          user_id: 'usr_1112223334',
          calculation_id: 'calc_fscore_999',
          scores: {
            financial_stability: 0.78,
            spending_consistency: 0.85,
            debt_management: 0.72,
            savings_rate: 0.91,
            overall_score: 0.815,
          },
          trend: 'improving',
          previous_score: 0.76,
        },
      },
      response: {
        status: 201,
        body: { received: true, stored: true },
      },
    },
    {
      event: 'forecast.generated',
      status: 'success',
      timestamp: '2025-10-24 14:22:10',
      duration: '298ms',
      webhook: 'Production Webhook',
      statusCode: 200,
      payload: {
        event: 'forecast.generated',
        timestamp: '2025-10-24T14:22:10.567Z',
        data: {
          user_id: 'usr_2223334445',
          forecast_id: 'fct_xyz456abc789',
          persona_type: 'budget_conscious',
          confidence_score: 0.91,
        },
      },
      response: { status: 200, body: { received: true, processed: true } },
    },
    {
      event: 'transaction.processed',
      status: 'success',
      timestamp: '2025-10-24 14:20:55',
      duration: '156ms',
      webhook: 'Production Webhook',
      statusCode: 200,
      payload: {
        event: 'transaction.processed',
        timestamp: '2025-10-24T14:20:55.234Z',
        data: {
          transaction_id: 'txn_abc123xyz',
          amount: 15000,
          currency: 'NGN',
          status: 'completed',
        },
      },
      response: { status: 200, body: { received: true } },
    },
    {
      event: 'persona.matched',
      status: 'success',
      timestamp: '2025-10-24 14:18:30',
      duration: '210ms',
      webhook: 'Staging Webhook',
      statusCode: 200,
      payload: {
        event: 'persona.matched',
        timestamp: '2025-10-24T14:18:30.890Z',
        data: {
          user_id: 'usr_6667778889',
          match_id: 'mtch_def456ghi789',
          persona: 'savvy_investor',
          match_score: 0.88,
        },
      },
      response: { status: 200, body: { received: true } },
    },
    {
      event: 'anomaly.detected',
      status: 'failed',
      timestamp: '2025-10-24 14:15:42',
      duration: '4.8s',
      webhook: 'Analytics Webhook',
      statusCode: 503,
      payload: {
        event: 'anomaly.detected',
        timestamp: '2025-10-24T14:15:42.123Z',
        data: {
          user_id: 'usr_9990001112',
          anomaly_id: 'anom_suspicious_002',
          type: 'rapid_transactions',
          severity: 'critical',
        },
      },
      response: { status: 503, body: { error: 'Service unavailable' } },
    },
    {
      event: 'fscores.calculated',
      status: 'success',
      timestamp: '2025-10-24 14:12:18',
      duration: '278ms',
      webhook: 'Staging Webhook',
      statusCode: 201,
      payload: {
        event: 'fscores.calculated',
        timestamp: '2025-10-24T14:12:18.456Z',
        data: {
          user_id: 'usr_3334445556',
          calculation_id: 'calc_fscore_888',
          scores: { overall_score: 0.742 },
        },
      },
      response: { status: 201, body: { received: true, stored: true } },
    },
    {
      event: 'forecast.generated',
      status: 'success',
      timestamp: '2025-10-24 14:08:45',
      duration: '325ms',
      webhook: 'Production Webhook',
      statusCode: 200,
      payload: {
        event: 'forecast.generated',
        timestamp: '2025-10-24T14:08:45.789Z',
        data: {
          user_id: 'usr_4445556667',
          forecast_id: 'fct_mno789pqr012',
          persona_type: 'risk_taker',
          confidence_score: 0.79,
        },
      },
      response: { status: 200, body: { received: true, processed: true } },
    },
    {
      event: 'transaction.processed',
      status: 'success',
      timestamp: '2025-10-24 14:05:22',
      duration: '142ms',
      webhook: 'Production Webhook',
      statusCode: 200,
      payload: {
        event: 'transaction.processed',
        timestamp: '2025-10-24T14:05:22.345Z',
        data: {
          transaction_id: 'txn_def456uvw',
          amount: 8500,
          currency: 'NGN',
          status: 'completed',
        },
      },
      response: { status: 200, body: { received: true } },
    },
    {
      event: 'persona.matched',
      status: 'failed',
      timestamp: '2025-10-24 14:02:10',
      duration: '6.1s',
      webhook: 'Analytics Webhook',
      statusCode: 500,
      payload: {
        event: 'persona.matched',
        timestamp: '2025-10-24T14:02:10.567Z',
        data: { user_id: 'usr_7778889990', match_id: 'mtch_invalid' },
      },
      response: { status: 500, body: { error: 'Database error' } },
    },
    {
      event: 'fscores.calculated',
      status: 'success',
      timestamp: '2025-10-24 13:58:33',
      duration: '289ms',
      webhook: 'Staging Webhook',
      statusCode: 201,
      payload: {
        event: 'fscores.calculated',
        timestamp: '2025-10-24T13:58:33.890Z',
        data: {
          user_id: 'usr_8889990001',
          calculation_id: 'calc_fscore_777',
          scores: { overall_score: 0.856 },
        },
      },
      response: { status: 201, body: { received: true, stored: true } },
    },
    {
      event: 'anomaly.detected',
      status: 'success',
      timestamp: '2025-10-24 13:55:17',
      duration: '412ms',
      webhook: 'Production Webhook',
      statusCode: 200,
      payload: {
        event: 'anomaly.detected',
        timestamp: '2025-10-24T13:55:17.234Z',
        data: {
          user_id: 'usr_9991112223',
          anomaly_id: 'anom_location_003',
          type: 'unusual_location',
          severity: 'medium',
        },
      },
      response: { status: 200, body: { received: true, flagged: true } },
    },
    {
      event: 'forecast.generated',
      status: 'success',
      timestamp: '2025-10-24 13:50:42',
      duration: '267ms',
      webhook: 'Production Webhook',
      statusCode: 200,
      payload: {
        event: 'forecast.generated',
        timestamp: '2025-10-24T13:50:42.123Z',
        data: {
          user_id: 'usr_0001112223',
          forecast_id: 'fct_stu345vwx678',
          persona_type: 'balanced_spender',
          confidence_score: 0.84,
        },
      },
      response: { status: 200, body: { received: true, processed: true } },
    },
    {
      event: 'transaction.processed',
      status: 'success',
      timestamp: '2025-10-24 13:45:28',
      duration: '178ms',
      webhook: 'Staging Webhook',
      statusCode: 200,
      payload: {
        event: 'transaction.processed',
        timestamp: '2025-10-24T13:45:28.456Z',
        data: {
          transaction_id: 'txn_ghi789jkl',
          amount: 22000,
          currency: 'NGN',
          status: 'completed',
        },
      },
      response: { status: 200, body: { received: true } },
    },
    {
      event: 'persona.matched',
      status: 'success',
      timestamp: '2025-10-24 13:40:15',
      duration: '195ms',
      webhook: 'Production Webhook',
      statusCode: 200,
      payload: {
        event: 'persona.matched',
        timestamp: '2025-10-24T13:40:15.789Z',
        data: {
          user_id: 'usr_1112223334',
          match_id: 'mtch_jkl012mno345',
          persona: 'frequent_shopper',
          match_score: 0.93,
        },
      },
      response: { status: 200, body: { received: true } },
    },
    {
      event: 'fscores.calculated',
      status: 'failed',
      timestamp: '2025-10-24 13:35:50',
      duration: '5.5s',
      webhook: 'Analytics Webhook',
      statusCode: 504,
      payload: {
        event: 'fscores.calculated',
        timestamp: '2025-10-24T13:35:50.234Z',
        data: { user_id: 'usr_2223334445', calculation_id: 'calc_fscore_666' },
      },
      response: { status: 504, body: { error: 'Gateway timeout' } },
    },
    {
      event: 'anomaly.detected',
      status: 'success',
      timestamp: '2025-10-24 13:30:22',
      duration: '388ms',
      webhook: 'Production Webhook',
      statusCode: 200,
      payload: {
        event: 'anomaly.detected',
        timestamp: '2025-10-24T13:30:22.567Z',
        data: {
          user_id: 'usr_3334445556',
          anomaly_id: 'anom_velocity_004',
          type: 'high_velocity',
          severity: 'low',
        },
      },
      response: { status: 200, body: { received: true, flagged: false } },
    },
    {
      event: 'forecast.generated',
      status: 'success',
      timestamp: '2025-10-24 13:25:08',
      duration: '301ms',
      webhook: 'Staging Webhook',
      statusCode: 200,
      payload: {
        event: 'forecast.generated',
        timestamp: '2025-10-24T13:25:08.890Z',
        data: {
          user_id: 'usr_4445556667',
          forecast_id: 'fct_yza901bcd234',
          persona_type: 'cautious_saver',
          confidence_score: 0.89,
        },
      },
      response: { status: 200, body: { received: true, processed: true } },
    },
  ]

  // NOTE: This component is designed to handle hundreds or thousands of webhook deliveries
  // Features include:
  // - Search by event name or webhook name
  // - Filter by status (all/success/failed)
  // - Pagination with configurable page size (10, 25, 50, 100 items per page)
  // - Expandable payload viewer for each delivery
  // - Copy to clipboard for request/response payloads

  // Filter webhooks
  const filteredWebhooks = useMemo(() => {
    let filtered = webhooks

    // Apply status filter
    if (webhookStatusFilter !== 'all') {
      filtered = filtered.filter((w) => w.status === webhookStatusFilter)
    }

    // Apply search filter
    if (webhookSearchQuery) {
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(webhookSearchQuery.toLowerCase()) ||
          w.url.toLowerCase().includes(webhookSearchQuery.toLowerCase()),
      )
    }

    return filtered
  }, [webhooks, webhookStatusFilter, webhookSearchQuery])

  // Filter and paginate deliveries
  const filteredDeliveries = useMemo(() => {
    let filtered = recentDeliveries

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((d) => d.status === statusFilter)
    }

    // Apply search filter
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

  const retryWebhook = async (deliveryId: string) => {
    setRetrying(deliveryId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRetrying(null)
    // Show success toast
    setToastMessage('Webhook retry triggered successfully!')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
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
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
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
              value: '3',
              icon: Webhook,
              gradient: { start: '#3b82f6', end: '#8b5cf6' },
            },
            {
              label: 'Active',
              value: '2',
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

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {[
            { id: 'configuration', label: 'Configuration', icon: Webhook },
            { id: 'logs', label: 'Logs & Usage', icon: Clock },
            { id: 'events', label: 'Events', icon: Zap },
            { id: 'examples', label: 'Examples', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'configuration' | 'logs' | 'events' | 'examples')}
              style={{
                padding: '12px 20px',
                background: activeTab === tab.id ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                border: 'none',
                borderBottom:
                  activeTab === tab.id ? '2px solid #10b981' : '2px solid transparent',
                color: activeTab === tab.id ? '#10b981' : '#9ca3af',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
            >
              <tab.icon style={{ width: '18px', height: '18px' }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Configuration Tab */}
        {activeTab === 'configuration' && (
          <>
            {/* Webhooks List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: '32px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              position: 'relative',
              zIndex: 100,
            }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
              Configured Webhooks
            </h2>

            {/* Webhook Search and Filter */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
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
                  placeholder="Search webhooks..."
                  value={webhookSearchQuery}
                  onChange={(e) => setWebhookSearchQuery(e.target.value)}
                  style={{
                    padding: '10px 14px 10px 40px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    width: '220px',
                  }}
                />
              </div>

              <CustomSelect
                value={webhookStatusFilter}
                onChange={(value) => setWebhookStatusFilter(value as any)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'error', label: 'Error' },
                ]}
                accentColor="#10b981"
                minWidth="150px"
              />
            </div>
          </div>

          {filteredWebhooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Webhook
                style={{
                  width: '48px',
                  height: '48px',
                  color: '#6b7280',
                  margin: '0 auto 16px',
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#9ca3af',
                  marginBottom: '8px',
                }}
              >
                No webhooks found
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                {webhookSearchQuery || webhookStatusFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Create your first webhook to get started'}
              </div>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredWebhooks.map((webhook, index) => {
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

                        {webhook.headers && Object.keys(webhook.headers).length > 0 && (
                          <div
                            style={{
                              padding: '12px',
                              borderRadius: '10px',
                              background: 'rgba(139, 92, 246, 0.05)',
                              border: '1px solid rgba(139, 92, 246, 0.2)',
                              marginBottom: '16px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#a78bfa',
                                fontWeight: '600',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                              }}
                            >
                              Custom Headers ({Object.keys(webhook.headers).length})
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {Object.entries(webhook.headers).map(([key, value]) => (
                                <div
                                  key={key}
                                  style={{
                                    fontSize: '13px',
                                    color: '#d1d5db',
                                    fontFamily: 'monospace',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                  }}
                                >
                                  <span style={{ color: '#a78bfa', fontWeight: '600' }}>
                                    {key}:
                                  </span>
                                  <span
                                    style={{
                                      color: '#9ca3af',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      maxWidth: '200px',
                                    }}
                                  >
                                    {value.includes('Bearer') || value.includes('key')
                                      ? value.substring(0, 20) + '...'
                                      : value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
          )}
        </motion.div>
        </>
      )}

      {/* Logs & Usage Tab */}
      {activeTab === 'logs' && (
        <>
        {/* Recent Deliveries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          {/* Header Section - Fixed */}
          <div style={{ flexShrink: 0, marginBottom: '20px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {/* Search Bar */}
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
                      transition: 'border-color 0.2s ease',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                  />
                </div>

                {/* Status Filter Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (statusFilter !== filter.key) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (statusFilter !== filter.key) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                Showing {paginatedDeliveries.length} of {filteredDeliveries.length} deliveries
              </div>
            </div>

            {/* Deliveries List - Scrollable */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                flex: '1 1 auto',
                minHeight: 0,
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {paginatedDeliveries.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <AlertCircle
                    style={{
                      width: '48px',
                      height: '48px',
                      color: '#6b7280',
                      margin: '0 auto 16px',
                      opacity: 0.5,
                    }}
                  />
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    No deliveries found
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your filters or search query'
                      : 'Webhook deliveries will appear here'}
                  </div>
                </motion.div>
              ) : (
                paginatedDeliveries.map((delivery, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    {/* Clickable Header */}
                    <div
                      onClick={() => setExpandedDelivery(expandedDelivery === i ? null : i)}
                      style={{
                        padding: '16px 18px',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '10px',
                        }}
                      >
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}
                        >
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
                              letterSpacing: '0.5px',
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
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <ChevronDown
                            style={{
                              width: '18px',
                              height: '18px',
                              color: '#9ca3af',
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#9ca3af',
                          marginBottom: '6px',
                          fontWeight: '500',
                        }}
                      >
                        {delivery.webhook}
                      </div>
                      <div
                        style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#6b7280' }}
                      >
                        <span>{delivery.timestamp}</span>
                        <span style={{ opacity: 0.5 }}>•</span>
                        <span>{delivery.duration}</span>
                      </div>
                    </div>{' '}
                    {/* Expanded Payload View */}
                    {expandedDelivery === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
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
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  retryWebhook(`delivery-${i}`)
                                }}
                                disabled={retrying === `delivery-${i}`}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  background:
                                    retrying === `delivery-${i}`
                                      ? 'rgba(59, 130, 246, 0.2)'
                                      : delivery.status === 'failed'
                                        ? 'rgba(239, 68, 68, 0.15)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  color:
                                    retrying === `delivery-${i}`
                                      ? '#3b82f6'
                                      : delivery.status === 'failed'
                                        ? '#ef4444'
                                        : '#9ca3af',
                                  cursor:
                                    retrying === `delivery-${i}` ? 'not-allowed' : 'pointer',
                                  fontSize: '11px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  opacity: retrying === `delivery-${i}` ? 0.7 : 1,
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <RotateCcw
                                  style={{
                                    width: '12px',
                                    height: '12px',
                                    animation:
                                      retrying === `delivery-${i}`
                                        ? 'spin 1s linear infinite'
                                        : 'none',
                                  }}
                                />
                                {retrying === `delivery-${i}` ? 'Retrying...' : 'Retry'}
                              </button>
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
                      </motion.div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Pagination Controls - Fixed at bottom */}
            {totalPages > 1 && (
              <div
                style={{
                  flexShrink: 0,
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
                  <CustomSelect
                    value={pageSize.toString()}
                    onChange={(value) => {
                      setPageSize(Number(value))
                      setCurrentPage(1)
                    }}
                    options={[
                      { value: '10', label: '10' },
                      { value: '25', label: '25' },
                      { value: '50', label: '50' },
                      { value: '100', label: '100' },
                    ]}
                    accentColor="#3b82f6"
                    minWidth="80px"
                  />
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
                        background:
                          currentPage === 1
                            ? 'rgba(255, 255, 255, 0.02)'
                            : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: currentPage === 1 ? '#4b5563' : '#9ca3af',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s ease',
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
                        background:
                          currentPage === totalPages
                            ? 'rgba(255, 255, 255, 0.02)'
                            : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: currentPage === totalPages ? '#4b5563' : '#9ca3af',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ChevronRight style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <>
        {/* Available Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '24px',
              flexShrink: 0,
            }}
          >
            Available Events
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: '1 1 auto',
              minHeight: 0,
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {availableEvents.map((event, i) => (
              <div
                key={i}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#10b981',
                    marginBottom: '6px',
                    fontFamily: 'monospace',
                  }}
                >
                  {event.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.5' }}>
                  {event.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
        </>
      )}

      {/* Examples Tab */}
      {activeTab === 'examples' && (
        <>
        {/* Webhook Payload Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
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
            style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}
          >
            Webhook Payload Examples
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Forecast Generated Payload */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#3b82f6',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                    }}
                  >
                    forecast.generated
                  </span>
                </h3>
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(
                        {
                          event: 'forecast.generated',
                          timestamp: '2025-10-24T14:32:15.234Z',
                          data: {
                            user_id: 'usr_1234567890',
                            forecast_id: 'fct_abc123def456',
                            persona_type: 'impulsive_spender',
                            confidence_score: 0.87,
                            predicted_behavior: {
                              spending_pattern: 'high_frequency',
                              risk_level: 'medium',
                              next_purchase_window: '3-5 days',
                            },
                            f_scores: {
                              financial_stability: 0.72,
                              spending_consistency: 0.65,
                              debt_management: 0.81,
                            },
                          },
                        },
                        null,
                        2,
                      ),
                      'forecast',
                    )
                  }
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background:
                      copied === 'forecast'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: copied === 'forecast' ? '#10b981' : '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {copied === 'forecast' ? (
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
              </div>
              <pre
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  overflowX: 'auto',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#e5e7eb',
                  fontFamily: 'monospace',
                }}
              >
                {JSON.stringify(
                  {
                    event: 'forecast.generated',
                    timestamp: '2025-10-24T14:32:15.234Z',
                    data: {
                      user_id: 'usr_1234567890',
                      forecast_id: 'fct_abc123def456',
                      persona_type: 'impulsive_spender',
                      confidence_score: 0.87,
                      predicted_behavior: {
                        spending_pattern: 'high_frequency',
                        risk_level: 'medium',
                        next_purchase_window: '3-5 days',
                      },
                      f_scores: {
                        financial_stability: 0.72,
                        spending_consistency: 0.65,
                        debt_management: 0.81,
                      },
                    },
                  },
                  null,
                  2,
                )}
              </pre>
            </div>

            {/* Persona Matched Payload */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#3b82f6',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                    }}
                  >
                    persona.matched
                  </span>
                </h3>
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(
                        {
                          event: 'persona.matched',
                          timestamp: '2025-10-24T14:30:42.123Z',
                          data: {
                            user_id: 'usr_9876543210',
                            match_id: 'mtch_xyz789ghi012',
                            persona: 'conservative_saver',
                            match_score: 0.92,
                            characteristics: {
                              saving_rate: 'high',
                              investment_preference: 'low_risk',
                              spending_discipline: 'high',
                            },
                            recommendations: [
                              'Fixed deposit accounts',
                              'Government bonds',
                              'Savings goals tracker',
                            ],
                          },
                        },
                        null,
                        2,
                      ),
                      'persona',
                    )
                  }
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background:
                      copied === 'persona'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: copied === 'persona' ? '#10b981' : '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {copied === 'persona' ? (
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
              </div>
              <pre
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  overflowX: 'auto',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#e5e7eb',
                  fontFamily: 'monospace',
                }}
              >
                {JSON.stringify(
                  {
                    event: 'persona.matched',
                    timestamp: '2025-10-24T14:30:42.123Z',
                    data: {
                      user_id: 'usr_9876543210',
                      match_id: 'mtch_xyz789ghi012',
                      persona: 'conservative_saver',
                      match_score: 0.92,
                      characteristics: {
                        saving_rate: 'high',
                        investment_preference: 'low_risk',
                        spending_discipline: 'high',
                      },
                      recommendations: [
                        'Fixed deposit accounts',
                        'Government bonds',
                        'Savings goals tracker',
                      ],
                    },
                  },
                  null,
                  2,
                )}
              </pre>
            </div>

            {/* Anomaly Detected Payload */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                    }}
                  >
                    anomaly.detected
                  </span>
                </h3>
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(
                        {
                          event: 'anomaly.detected',
                          timestamp: '2025-10-24T14:28:18.987Z',
                          data: {
                            user_id: 'usr_5555666777',
                            anomaly_id: 'anom_unusual_001',
                            type: 'unusual_spending_pattern',
                            severity: 'high',
                            details: {
                              transaction_amount: 25000,
                              average_transaction: 1500,
                              deviation_percentage: 1567,
                              location: 'Lagos, Nigeria',
                              merchant_category: 'Electronics',
                            },
                            risk_indicators: [
                              'Amount 15x higher than average',
                              'First-time merchant',
                              'Unusual time of transaction',
                            ],
                          },
                        },
                        null,
                        2,
                      ),
                      'anomaly',
                    )
                  }
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background:
                      copied === 'anomaly'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: copied === 'anomaly' ? '#10b981' : '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {copied === 'anomaly' ? (
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
              </div>
              <pre
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  overflowX: 'auto',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#e5e7eb',
                  fontFamily: 'monospace',
                }}
              >
                {JSON.stringify(
                  {
                    event: 'anomaly.detected',
                    timestamp: '2025-10-24T14:28:18.987Z',
                    data: {
                      user_id: 'usr_5555666777',
                      anomaly_id: 'anom_unusual_001',
                      type: 'unusual_spending_pattern',
                      severity: 'high',
                      details: {
                        transaction_amount: 25000,
                        average_transaction: 1500,
                        deviation_percentage: 1567,
                        location: 'Lagos, Nigeria',
                        merchant_category: 'Electronics',
                      },
                      risk_indicators: [
                        'Amount 15x higher than average',
                        'First-time merchant',
                        'Unusual time of transaction',
                      ],
                    },
                  },
                  null,
                  2,
                )}
              </pre>
            </div>

            {/* Webhook Headers Info */}
            <div
              style={{
                marginTop: '16px',
                padding: '20px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <h4
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '12px',
                }}
              >
                Webhook Headers
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                  <code style={{ color: '#9ca3af', fontFamily: 'monospace', minWidth: '180px' }}>
                    Content-Type:
                  </code>
                  <span style={{ color: 'white', fontFamily: 'monospace' }}>application/json</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                  <code style={{ color: '#9ca3af', fontFamily: 'monospace', minWidth: '180px' }}>
                    X-Sonaqor-Event:
                  </code>
                  <span style={{ color: 'white', fontFamily: 'monospace' }}>
                    forecast.generated | persona.matched | anomaly.detected
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                  <code style={{ color: '#9ca3af', fontFamily: 'monospace', minWidth: '180px' }}>
                    X-Sonaqor-Signature:
                  </code>
                  <span style={{ color: 'white', fontFamily: 'monospace' }}>
                    sha256=&lt;HMAC signature&gt;
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                  <code style={{ color: '#9ca3af', fontFamily: 'monospace', minWidth: '180px' }}>
                    X-Sonaqor-Delivery:
                  </code>
                  <span style={{ color: 'white', fontFamily: 'monospace' }}>
                    &lt;unique delivery ID&gt;
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        </>
      )}

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
                      fontWeight: '500',
                    }}
                  >
                    Webhook Name *
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
                      fontWeight: '500',
                    }}
                  >
                    Endpoint URL *
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
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <label
                      style={{
                        fontSize: '14px',
                        color: '#9ca3af',
                        fontWeight: '500',
                      }}
                    >
                      Custom Headers (Optional)
                    </label>
                    <button
                      onClick={() => setWebhookHeaders([...webhookHeaders, { key: '', value: '' }])}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10b981',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Plus style={{ width: '14px', height: '14px' }} />
                      Add Header
                    </button>
                  </div>
                  {webhookHeaders.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {webhookHeaders.map((header, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <input
                            type="text"
                            value={header.key}
                            onChange={(e) => {
                              const newHeaders = [...webhookHeaders]
                              newHeaders[index].key = e.target.value
                              setWebhookHeaders(newHeaders)
                            }}
                            placeholder="Header name (e.g., Authorization)"
                            style={{
                              flex: 1,
                              padding: '10px 12px',
                              borderRadius: '8px',
                              background: 'rgba(0, 0, 0, 0.3)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              fontSize: '14px',
                              outline: 'none',
                            }}
                          />
                          <input
                            type="text"
                            value={header.value}
                            onChange={(e) => {
                              const newHeaders = [...webhookHeaders]
                              newHeaders[index].value = e.target.value
                              setWebhookHeaders(newHeaders)
                            }}
                            placeholder="Header value"
                            style={{
                              flex: 1,
                              padding: '10px 12px',
                              borderRadius: '8px',
                              background: 'rgba(0, 0, 0, 0.3)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              fontSize: '14px',
                              outline: 'none',
                            }}
                          />
                          <button
                            onClick={() => {
                              setWebhookHeaders(webhookHeaders.filter((_, i) => i !== index))
                            }}
                            style={{
                              padding: '8px',
                              borderRadius: '8px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#ef4444',
                              cursor: 'pointer',
                            }}
                          >
                            <X style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {webhookHeaders.length === 0 && (
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        textAlign: 'center',
                        color: '#6b7280',
                        fontSize: '13px',
                      }}
                    >
                      No custom headers configured. Click &quot;Add Header&quot; to add
                      authentication or custom headers.
                    </div>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: '#9ca3af',
                      marginBottom: '12px',
                      fontWeight: '500',
                    }}
                  >
                    Events to Subscribe *
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

      {/* Edit Webhook Modal */}
      <AnimatePresence>
        {showEditModal && selectedWebhook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditModal(false)}
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
                  Edit Webhook
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
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
                      fontWeight: '500',
                    }}
                  >
                    Webhook Name *
                  </label>
                  <input
                    type="text"
                    value={webhookName}
                    onChange={(e) => setWebhookName(e.target.value)}
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
                      fontWeight: '500',
                    }}
                  >
                    Endpoint URL *
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
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
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <label
                      style={{
                        fontSize: '14px',
                        color: '#9ca3af',
                        fontWeight: '500',
                      }}
                    >
                      Custom Headers (Optional)
                    </label>
                    <button
                      onClick={() => setWebhookHeaders([...webhookHeaders, { key: '', value: '' }])}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10b981',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Plus style={{ width: '14px', height: '14px' }} />
                      Add Header
                    </button>
                  </div>
                  {webhookHeaders.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {webhookHeaders.map((header, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <input
                            type="text"
                            value={header.key}
                            onChange={(e) => {
                              const newHeaders = [...webhookHeaders]
                              newHeaders[index].key = e.target.value
                              setWebhookHeaders(newHeaders)
                            }}
                            placeholder="Header name (e.g., Authorization)"
                            style={{
                              flex: 1,
                              padding: '10px 12px',
                              borderRadius: '8px',
                              background: 'rgba(0, 0, 0, 0.3)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              fontSize: '14px',
                              outline: 'none',
                            }}
                          />
                          <input
                            type="text"
                            value={header.value}
                            onChange={(e) => {
                              const newHeaders = [...webhookHeaders]
                              newHeaders[index].value = e.target.value
                              setWebhookHeaders(newHeaders)
                            }}
                            placeholder="Header value"
                            style={{
                              flex: 1,
                              padding: '10px 12px',
                              borderRadius: '8px',
                              background: 'rgba(0, 0, 0, 0.3)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              fontSize: '14px',
                              outline: 'none',
                            }}
                          />
                          <button
                            onClick={() => {
                              setWebhookHeaders(webhookHeaders.filter((_, i) => i !== index))
                            }}
                            style={{
                              padding: '8px',
                              borderRadius: '8px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#ef4444',
                              cursor: 'pointer',
                            }}
                          >
                            <X style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {webhookHeaders.length === 0 && (
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        textAlign: 'center',
                        color: '#6b7280',
                        fontSize: '13px',
                      }}
                    >
                      No custom headers configured. Click &quot;Add Header&quot; to add
                      authentication or custom headers.
                    </div>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: '#9ca3af',
                      marginBottom: '12px',
                      fontWeight: '500',
                    }}
                  >
                    Events to Subscribe *
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
                  onClick={() => setShowEditModal(false)}
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
                  onClick={handleEditWebhook}
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
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Webhook Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedWebhook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
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
                maxWidth: '500px',
                width: '100%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '2px solid rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <AlertCircle style={{ width: '32px', height: '32px', color: '#ef4444' }} />
                </div>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '12px',
                  }}
                >
                  Delete Webhook
                </h2>
                <p style={{ fontSize: '15px', color: '#9ca3af', lineHeight: '1.6' }}>
                  Are you sure you want to delete{' '}
                  <strong style={{ color: 'white' }}>{selectedWebhook.name}</strong>? This action
                  cannot be undone and all delivery history will be lost.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => setShowDeleteModal(false)}
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
                  onClick={handleDeleteWebhook}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                  }}
                >
                  Delete Webhook
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Webhook Modal */}
      <AnimatePresence>
        {showTestModal && selectedWebhook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTestModal(false)}
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
                maxWidth: '500px',
                width: '100%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
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
                  Test Webhook
                </h2>
                <button
                  onClick={() => setShowTestModal(false)}
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

              <div style={{ marginBottom: '24px' }}>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#9ca3af',
                    marginBottom: '16px',
                    lineHeight: '1.6',
                  }}
                >
                  Send a test delivery to{' '}
                  <strong style={{ color: 'white' }}>{selectedWebhook.name}</strong> to verify your
                  endpoint is working correctly.
                </p>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>
                    Endpoint URL
                  </div>
                  <code
                    style={{
                      fontSize: '14px',
                      color: '#3b82f6',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                    }}
                  >
                    {selectedWebhook.url}
                  </code>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => setShowTestModal(false)}
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
                  onClick={handleTestWebhook}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Send style={{ width: '16px', height: '16px' }} />
                  Send Test
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '12px',
              padding: '16px 24px',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 10000,
              maxWidth: '400px',
            }}
          >
            <CheckCircle style={{ width: '20px', height: '20px', color: 'white' }} />
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
