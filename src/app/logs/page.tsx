'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Filter,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

interface LogEntry {
  id: string
  timestamp: string
  method: string
  endpoint: string
  status: number
  duration: number
  ip: string
  apiKey: string
  requestBody?: any
  responseBody?: any
  headers?: Record<string, string>
}

export default function LogsPage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedLog, setExpandedLog] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const logs: LogEntry[] = [
    {
      id: '1',
      timestamp: '2025-10-24 14:32:15',
      method: 'POST',
      endpoint: '/v1/forecast/generate',
      status: 200,
      duration: 1.8,
      ip: '192.168.1.1',
      apiKey: 'sk_live_****9pQ',
      requestBody: {
        user_id: 'usr_1234567890',
        transaction_data: {
          amount: 5000,
          merchant: 'Amazon',
          category: 'Shopping',
          location: 'Lagos, Nigeria',
        },
      },
      responseBody: {
        forecast_id: 'fct_abc123def456',
        persona_type: 'impulsive_spender',
        confidence_score: 0.87,
        predicted_behavior: {
          spending_pattern: 'high_frequency',
          risk_level: 'medium',
        },
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_live_****9pQ',
        'User-Agent': 'SonaqorSDK/1.0.0',
      },
    },
    {
      id: '2',
      timestamp: '2025-10-24 14:31:42',
      method: 'POST',
      endpoint: '/v1/persona/match',
      status: 200,
      duration: 0.9,
      ip: '192.168.1.2',
      apiKey: 'sk_live_****9pQ',
      requestBody: {
        user_id: 'usr_9876543210',
        transaction_history: [
          { amount: 1000, category: 'Savings' },
          { amount: 500, category: 'Investment' },
        ],
      },
      responseBody: {
        match_id: 'mtch_xyz789ghi012',
        persona: 'conservative_saver',
        match_score: 0.92,
        recommendations: ['Fixed deposit accounts', 'Government bonds'],
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_live_****9pQ',
      },
    },
    {
      id: '3',
      timestamp: '2025-10-24 14:30:18',
      method: 'GET',
      endpoint: '/v1/fscores/calculate',
      status: 429,
      duration: 0.1,
      ip: '192.168.1.3',
      apiKey: 'sk_test_****9pQ',
      requestBody: null,
      responseBody: {
        error: 'rate_limit_exceeded',
        message: 'You have exceeded the rate limit. Please try again in 60 seconds.',
        retry_after: 60,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_test_****9pQ',
      },
    },
    {
      id: '4',
      timestamp: '2025-10-24 14:29:55',
      method: 'POST',
      endpoint: '/v1/forecast/generate',
      status: 500,
      duration: 5.2,
      ip: '192.168.1.1',
      apiKey: 'sk_live_****9pQ',
      requestBody: {
        user_id: 'usr_error_test',
        transaction_data: {
          amount: 10000,
          merchant: 'Test Merchant',
        },
      },
      responseBody: {
        error: 'internal_server_error',
        message: 'An unexpected error occurred while processing the forecast.',
        request_id: 'req_error_12345',
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_live_****9pQ',
      },
    },
    {
      id: '5',
      timestamp: '2025-10-24 14:28:33',
      method: 'POST',
      endpoint: '/v1/persona/match',
      status: 200,
      duration: 1.1,
      ip: '192.168.1.4',
      apiKey: 'sk_live_****9pQ',
      requestBody: {
        user_id: 'usr_5555666777',
        transaction_history: [
          { amount: 25000, category: 'Electronics' },
          { amount: 30000, category: 'Furniture' },
        ],
      },
      responseBody: {
        match_id: 'mtch_impulsive_123',
        persona: 'big_spender',
        match_score: 0.95,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_live_****9pQ',
      },
    },
    {
      id: '6',
      timestamp: '2025-10-24 14:27:10',
      method: 'GET',
      endpoint: '/v1/health',
      status: 200,
      duration: 0.05,
      ip: '192.168.1.5',
      apiKey: 'sk_live_****9pQ',
      requestBody: null,
      responseBody: {
        status: 'healthy',
        version: '1.0.0',
        uptime: 345600,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ]

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return { bg: 'rgba(16, 185, 129, 0.2)', border: 'rgba(16, 185, 129, 0.3)', text: '#10b981' }
    if (status >= 400 && status < 500)
      return { bg: 'rgba(251, 191, 36, 0.2)', border: 'rgba(251, 191, 36, 0.3)', text: '#fbbf24' }
    if (status >= 500)
      return { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' }
    return { bg: 'rgba(156, 163, 175, 0.2)', border: 'rgba(156, 163, 175, 0.3)', text: '#9ca3af' }
  }

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300)
      return <CheckCircle style={{ width: '16px', height: '16px' }} />
    if (status >= 400 && status < 500)
      return <AlertTriangle style={{ width: '16px', height: '16px' }} />
    if (status >= 500) return <XCircle style={{ width: '16px', height: '16px' }} />
    return <Clock style={{ width: '16px', height: '16px' }} />
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' }
      case 'POST':
        return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' }
      case 'PUT':
        return { bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' }
      case 'DELETE':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' }
      default:
        return { bg: 'rgba(156, 163, 175, 0.2)', text: '#9ca3af' }
    }
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
        <div style={{ padding: '32px 40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
            API Logs
          </h1>
          <p style={{ fontSize: '16px', color: '#9ca3af' }}>
            Monitor and analyze your API requests in real-time
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '40px' }}>
        {/* Stats Overview */}
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
              label: 'Total Requests',
              value: '45,234',
              icon: Activity,
              gradient: { start: '#3b82f6', end: '#8b5cf6' },
            },
            {
              label: 'Success Rate',
              value: '50.2%',
              icon: CheckCircle,
              gradient: { start: '#10b981', end: '#059669' },
            },
            {
              label: 'Avg Response',
              value: '1.2s',
              icon: Clock,
              gradient: { start: '#a855f7', end: '#ec4899' },
            },
            {
              label: 'Errors',
              value: '342',
              icon: XCircle,
              gradient: { start: '#ef4444', end: '#dc2626' },
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

        {/* Filters */}
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
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
        >
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
              <Search
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af',
                }}
              />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', 'Success', 'Errors', 'Warnings'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f.toLowerCase())}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    background:
                      filter === f.toLowerCase()
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${
                      filter === f.toLowerCase()
                        ? 'rgba(16, 185, 129, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)'
                    }`,
                    color: filter === f.toLowerCase() ? '#10b981' : '#9ca3af',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (filter !== f.toLowerCase()) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filter !== f.toLowerCase()) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Export */}
            <button
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#9ca3af',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
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
              <Download style={{ width: '18px', height: '18px' }} />
              Export
            </button>
          </div>
        </motion.div>

        {/* Logs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 80px 1fr 100px 100px 140px 140px 60px',
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '13px',
              fontWeight: '600',
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <div>Timestamp</div>
            <div>Method</div>
            <div>Endpoint</div>
            <div>Status</div>
            <div>Duration</div>
            <div>IP Address</div>
            <div>API Key</div>
            <div></div>
          </div>

          {/* Table Body */}
          <div>
            {logs.map((log, index) => {
              const statusColor = getStatusColor(log.status)
              const methodColor = getMethodColor(log.method)
              const isExpanded = expandedLog === log.id

              return (
                <div key={log.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '180px 80px 1fr 100px 100px 140px 140px 60px',
                      padding: '20px 24px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      alignItems: 'center',
                      transition: 'background 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ fontSize: '13px', color: '#9ca3af', fontFamily: 'monospace' }}>
                      {log.timestamp}
                    </div>
                    <div>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: methodColor.bg,
                          color: methodColor.text,
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {log.method}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: 'white', fontFamily: 'monospace' }}>
                      {log.endpoint}
                    </div>
                    <div>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: statusColor.bg,
                          border: `1px solid ${statusColor.border}`,
                          color: statusColor.text,
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {getStatusIcon(log.status)}
                        {log.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>{log.duration}s</div>
                    <div style={{ fontSize: '13px', color: '#9ca3af', fontFamily: 'monospace' }}>
                      {log.ip}
                    </div>
                    <div style={{ fontSize: '13px', color: '#9ca3af', fontFamily: 'monospace' }}>
                      {log.apiKey}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      {isExpanded ? (
                        <ChevronUp style={{ width: '18px', height: '18px', color: '#9ca3af' }} />
                      ) : (
                        <ChevronDown style={{ width: '18px', height: '18px', color: '#9ca3af' }} />
                      )}
                    </div>
                  </motion.div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        padding: '24px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '24px',
                        }}
                      >
                        {/* Request Headers */}
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#9ca3af',
                              marginBottom: '12px',
                            }}
                          >
                            Request Headers
                          </div>
                          <pre
                            style={{
                              padding: '16px',
                              borderRadius: '10px',
                              background: 'rgba(0, 0, 0, 0.4)',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              fontSize: '12px',
                              lineHeight: '1.6',
                              color: '#e5e7eb',
                              fontFamily: 'monospace',
                              overflowX: 'auto',
                            }}
                          >
                            {JSON.stringify(log.headers, null, 2)}
                          </pre>
                        </div>

                        {/* Request Body */}
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '12px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#9ca3af',
                              }}
                            >
                              Request Body
                            </div>
                            {log.requestBody && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(
                                    JSON.stringify(log.requestBody, null, 2),
                                    `request-${log.id}`,
                                  )
                                }}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  background:
                                    copied === `request-${log.id}`
                                      ? 'rgba(16, 185, 129, 0.2)'
                                      : 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  color: copied === `request-${log.id}` ? '#10b981' : '#9ca3af',
                                  cursor: 'pointer',
                                  fontSize: '11px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                {copied === `request-${log.id}` ? (
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
                            )}
                          </div>
                          <pre
                            style={{
                              padding: '16px',
                              borderRadius: '10px',
                              background: 'rgba(0, 0, 0, 0.4)',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              fontSize: '12px',
                              lineHeight: '1.6',
                              color: '#e5e7eb',
                              fontFamily: 'monospace',
                              overflowX: 'auto',
                            }}
                          >
                            {log.requestBody
                              ? JSON.stringify(log.requestBody, null, 2)
                              : 'No request body'}
                          </pre>
                        </div>

                        {/* Response Body - Full Width */}
                        <div style={{ gridColumn: '1 / -1' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '12px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#9ca3af',
                              }}
                            >
                              Response Body
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(
                                  JSON.stringify(log.responseBody, null, 2),
                                  `response-${log.id}`,
                                )
                              }}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                background:
                                  copied === `response-${log.id}`
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: copied === `response-${log.id}` ? '#10b981' : '#9ca3af',
                                cursor: 'pointer',
                                fontSize: '11px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              {copied === `response-${log.id}` ? (
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
                              padding: '16px',
                              borderRadius: '10px',
                              background: 'rgba(0, 0, 0, 0.4)',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              fontSize: '12px',
                              lineHeight: '1.6',
                              color: '#e5e7eb',
                              fontFamily: 'monospace',
                              overflowX: 'auto',
                              maxHeight: '400px',
                              overflowY: 'auto',
                            }}
                          >
                            {JSON.stringify(log.responseBody, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
