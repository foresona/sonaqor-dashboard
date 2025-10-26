'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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
import { getLogsData, type LogsData, type APILogEntry } from '@/data/logs'

function LogsPageContent() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<LogsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedLog, setExpandedLog] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'timestamp' | 'app' | 'status' | 'duration'>('timestamp')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [appFilter, setAppFilter] = useState<string>('all')
  const [envFilter, setEnvFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [timeFrom, setTimeFrom] = useState<string>('')
  const [timeTo, setTimeTo] = useState<string>('')
  const [showAppDropdown, setShowAppDropdown] = useState(false)
  const [showEnvDropdown, setShowEnvDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  // Set filters from URL params on mount
  useEffect(() => {
    const appParam = searchParams.get('app')
    const envParam = searchParams.get('env')

    if (appParam) {
      setAppFilter(appParam)
    }
    if (envParam) {
      setEnvFilter(envParam)
    }
  }, [searchParams])

  useEffect(() => {
    fetchData()
  }, [searchQuery, filter])

  const fetchData = async () => {
    setLoading(true)
    const logsData = await getLogsData(searchQuery, filter)
    setData(logsData)
    setLoading(false)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2))
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return CheckCircle
    if (status >= 400 && status < 500) return AlertTriangle
    if (status >= 500) return XCircle
    return Clock
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return { bg: 'rgba(16, 185, 129, 0.2)', border: 'rgba(16, 185, 129, 0.3)', text: '#10b981' }
    if (status >= 400 && status < 500)
      return { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.3)', text: '#f59e0b' }
    if (status >= 500)
      return { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' }
    return { bg: 'rgba(107, 114, 128, 0.2)', border: 'rgba(107, 114, 128, 0.3)', text: '#6b7280' }
  }

  const getMethodColor = (method: string) => {
    const colors: any = {
      GET: { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' },
      POST: { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' },
      PUT: { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b' },
      DELETE: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
      PATCH: { bg: 'rgba(167, 139, 250, 0.2)', text: '#a78bfa' },
    }
    return colors[method] || { bg: 'rgba(107, 114, 128, 0.2)', text: '#6b7280' }
  }

  // parse durations like '1.2s' or '845ms' into milliseconds
  const parseDurationMs = (d: string) => {
    if (!d) return 0
    const s = d.toString().trim()
    if (s.endsWith('ms')) return parseFloat(s.replace('ms', ''))
    if (s.endsWith('s')) return parseFloat(s.replace('s', '')) * 1000
    // fallback: try numeric
    const n = parseFloat(s)
    return Number.isNaN(n) ? 0 : n
  }

  const filteredLogs = useMemo(() => {
    if (!data) return []
    return data.logs.filter((log) => {
      const matchesSearch =
        searchQuery === '' ||
        log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ip.includes(searchQuery)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'success' && log.status >= 200 && log.status < 300) ||
        (filter === 'error' && log.status >= 400)
      const matchesApp = appFilter === 'all' || log.appName === appFilter
      const matchesEnv = envFilter === 'all' || log.environment === envFilter

      // Date range filter
      let matchesDateRange = true
      if (dateFrom || dateTo) {
        const logDate = new Date(log.timestamp)
        if (dateFrom) {
          const fromDateTime = new Date(dateFrom)
          // If timeFrom is specified, set the time, otherwise start of day
          if (timeFrom) {
            const [hours, minutes] = timeFrom.split(':')
            fromDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
          } else {
            fromDateTime.setHours(0, 0, 0, 0)
          }
          matchesDateRange = matchesDateRange && logDate >= fromDateTime
        }
        if (dateTo) {
          const toDateTime = new Date(dateTo)
          // If timeTo is specified, set the time, otherwise end of day
          if (timeTo) {
            const [hours, minutes] = timeTo.split(':')
            toDateTime.setHours(parseInt(hours), parseInt(minutes), 59, 999)
          } else {
            toDateTime.setHours(23, 59, 59, 999) // Include entire end date
          }
          matchesDateRange = matchesDateRange && logDate <= toDateTime
        }
      }

      return matchesSearch && matchesFilter && matchesApp && matchesEnv && matchesDateRange
    })
  }, [data, searchQuery, filter, appFilter, envFilter, dateFrom, dateTo])

  // Get unique app names for the filter dropdown
  const uniqueAppNames = useMemo(() => {
    if (!data) return []
    const names = new Set(
      data.logs.map((log) => log.appName).filter((name): name is string => Boolean(name)),
    )
    return Array.from(names).sort()
  }, [data])

  // Get unique environments for the filter dropdown
  const uniqueEnvironments = useMemo(() => {
    if (!data) return []
    const envs = new Set(
      data.logs.map((log) => log.environment).filter((env): env is string => Boolean(env)),
    )
    return Array.from(envs).sort()
  }, [data])

  const sortedLogs = useMemo(() => {
    const arr = [...filteredLogs]
    arr.sort((a, b) => {
      let res = 0
      if (sortBy === 'app') {
        res = (a.appName || '').localeCompare(b.appName || '')
      } else if (sortBy === 'status') {
        res = a.status - b.status
      } else if (sortBy === 'duration') {
        res = parseDurationMs(a.duration) - parseDurationMs(b.duration)
      } else {
        // timestamp (newest first by default)
        const ta = new Date(a.timestamp).getTime()
        const tb = new Date(b.timestamp).getTime()
        res = ta - tb
      }
      return sortOrder === 'asc' ? res : -res
    })
    return arr
  }, [filteredLogs, sortBy, sortOrder])

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          Loading API logs...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Activity style={{ width: '32px', height: '32px', color: '#10b981' }} />
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
              API Logs
            </h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Monitor and analyze your API requests in real-time • {data.stats.totalRequests} total
            requests
          </p>
        </div>
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
              value: data.stats.totalRequests,
              icon: Activity,
              gradient: { start: '#3b82f6', end: '#8b5cf6' },
            },
            {
              label: 'Success Rate',
              value: `${data.stats.successRate}%`,
              icon: CheckCircle,
              gradient: { start: '#10b981', end: '#059669' },
            },
            {
              label: 'Avg Response',
              value: data.stats.avgResponse,
              icon: Clock,
              gradient: { start: '#a855f7', end: '#ec4899' },
            },
            {
              label: 'Errors',
              value: data.stats.errors.toString(),
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
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Row 1: Search and Filters */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '16px',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 10,
            }}
          >
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

            {/* App Filter */}
            <div style={{ position: 'relative', minWidth: '180px' }}>
              <button
                onClick={() => setShowAppDropdown(!showAppDropdown)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)'
                  e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <span>{appFilter === 'all' ? 'All Apps' : appFilter}</span>
                <ChevronDown
                  style={{
                    width: '16px',
                    height: '16px',
                    transform: showAppDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {showAppDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    zIndex: 9999,
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                    maxHeight: '300px',
                    overflowY: 'auto',
                  }}
                >
                  <button
                    onClick={() => {
                      setAppFilter('all')
                      setShowAppDropdown(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: appFilter === 'all' ? 'rgba(167, 139, 250, 0.2)' : 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      color: appFilter === 'all' ? '#a78bfa' : 'white',
                      fontSize: '14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (appFilter !== 'all') {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (appFilter !== 'all') {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    All Apps
                  </button>
                  {uniqueAppNames.map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        setAppFilter(name)
                        setShowAppDropdown(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: appFilter === name ? 'rgba(167, 139, 250, 0.2)' : 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        color: appFilter === name ? '#a78bfa' : 'white',
                        fontSize: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (appFilter !== name) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (appFilter !== name) {
                          e.currentTarget.style.background = 'transparent'
                        }
                      }}
                    >
                      {name}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Environment Filter */}
            <div style={{ position: 'relative', minWidth: '180px' }}>
              <button
                onClick={() => setShowEnvDropdown(!showEnvDropdown)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)'
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <span>
                  {envFilter === 'all'
                    ? 'All Environments'
                    : envFilter.charAt(0).toUpperCase() + envFilter.slice(1)}
                </span>
                <ChevronDown
                  style={{
                    width: '16px',
                    height: '16px',
                    transform: showEnvDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {showEnvDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    zIndex: 9999,
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <button
                    onClick={() => {
                      setEnvFilter('all')
                      setShowEnvDropdown(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: envFilter === 'all' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      color: envFilter === 'all' ? '#3b82f6' : 'white',
                      fontSize: '14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (envFilter !== 'all') {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (envFilter !== 'all') {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    All Environments
                  </button>
                  {uniqueEnvironments.map((env) => (
                    <button
                      key={env}
                      onClick={() => {
                        setEnvFilter(env)
                        setShowEnvDropdown(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: envFilter === env ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        color: envFilter === env ? '#3b82f6' : 'white',
                        fontSize: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (envFilter !== env) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (envFilter !== env) {
                          e.currentTarget.style.background = 'transparent'
                        }
                      }}
                    >
                      {env.charAt(0).toUpperCase() + env.slice(1)}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Date From */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From Date"
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '150px',
                  colorScheme: 'dark',
                }}
              />
              <input
                type="time"
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
                placeholder="From Time"
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '120px',
                  colorScheme: 'dark',
                }}
              />
            </div>

            {/* Date To */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To Date"
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '150px',
                  colorScheme: 'dark',
                }}
              />
              <input
                type="time"
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
                placeholder="To Time"
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '120px',
                  colorScheme: 'dark',
                }}
              />
            </div>

            {/* Clear Date Filter Button */}
            {(dateFrom || dateTo || timeFrom || timeTo) && (
              <button
                onClick={() => {
                  setDateFrom('')
                  setDateTo('')
                  setTimeFrom('')
                  setTimeTo('')
                }}
                title="Clear date & time filter"
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  minWidth: '44px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Row 2: Sort and Status Filters */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 9,
            }}
          >
            {/* Filter Buttons - Left Side */}
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

            {/* Sort Controls - Right Side */}
            <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto', alignItems: 'center' }}>
              {/* Sort By */}
              <div style={{ position: 'relative', minWidth: '160px' }}>
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)'
                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span>
                    {sortBy === 'timestamp' && 'Sort by Time'}
                    {sortBy === 'app' && 'Sort by App'}
                    {sortBy === 'status' && 'Sort by Status'}
                    {sortBy === 'duration' && 'Sort by Duration'}
                  </span>
                  <ChevronDown
                    style={{
                      width: '16px',
                      height: '16px',
                      transform: showSortDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>

                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: 0,
                      right: 0,
                      background: 'rgba(0, 0, 0, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      zIndex: 9999,
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {[
                      { value: 'timestamp', label: 'Sort by Time' },
                      { value: 'app', label: 'Sort by App' },
                      { value: 'status', label: 'Sort by Status' },
                      { value: 'duration', label: 'Sort by Duration' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value as any)
                          setShowSortDropdown(false)
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background:
                            sortBy === option.value ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          color: sortBy === option.value ? '#10b981' : 'white',
                          fontSize: '14px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (sortBy !== option.value) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (sortBy !== option.value) {
                            e.currentTarget.style.background = 'transparent'
                          }
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Sort Order Button */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: sortOrder === 'desc' ? '#10b981' : '#9ca3af',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '80px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)')}
              >
                {sortOrder === 'asc' ? 'ASC' : 'DESC'}
              </button>

              {/* Export Button */}
              <button
                title="Export logs"
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)'
                  e.currentTarget.style.color = '#10b981'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
                  e.currentTarget.style.color = '#9ca3af'
                }}
              >
                <Download style={{ width: '16px', height: '16px' }} />
                Export
              </button>
            </div>
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
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 80px 1fr 120px 120px 100px 100px 140px 140px 60px',
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
            <div>App</div>
            <div>Environment</div>
            <div>Status</div>
            <div>Duration</div>
            <div>IP Address</div>
            <div>API Key</div>
            <div></div>
          </div>

          {/* Table Body */}
          <div>
            {sortedLogs.map((log, index) => {
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
                      gridTemplateColumns:
                        '180px 80px 1fr 120px 120px 100px 100px 140px 140px 60px',
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
                          background: 'rgba(167, 139, 250, 0.1)',
                          border: '1px solid rgba(167, 139, 250, 0.3)',
                          color: '#a78bfa',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}
                      >
                        {log.appName || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: '#3b82f6',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                        }}
                      >
                        {log.environment || 'N/A'}
                      </span>
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
                        {React.createElement(getStatusIcon(log.status), { size: 16 })}
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
                            {JSON.stringify(log.requestHeaders, null, 2)}
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

export default function LogsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          color: '#9ca3af'
        }}>
          Loading logs...
        </div>
      </DashboardLayout>
    }>
      <LogsPageContent />
    </Suspense>
  )
}
