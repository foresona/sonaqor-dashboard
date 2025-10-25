'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { getIntelligenceData, type IntelligenceData } from '@/data/intelligence'
import { getProjectsData } from '@/data/projects'
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Target,
  AlertCircle,
  Calendar,
  Filter,
  Download,
  BarChart3,
  Eye,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function IntelligenceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const appId = searchParams.get('app')
  const projectId = searchParams.get('project')

  const [data, setData] = useState<IntelligenceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('30d')
  const [notification, setNotification] = useState<string | null>(null)

  // Filter states
  const [projects, setProjects] = useState<any[]>([])
  const [apps, setApps] = useState<any[]>([])
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all')
  const [selectedAppFilter, setSelectedAppFilter] = useState<string>('all')

  useEffect(() => {
    fetchData()
    fetchProjectsAndApps()
  }, [timeRange])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  useEffect(() => {
    // Set initial filters from URL params
    if (appId) setSelectedAppFilter(appId)
    if (projectId) setSelectedProjectFilter(projectId)
  }, [appId, projectId])

  const fetchData = async () => {
    setLoading(true)
    const intelligenceData = await getIntelligenceData(timeRange)
    setData(intelligenceData)
    setLoading(false)
  }

  const fetchProjectsAndApps = async () => {
    const projectsData = await getProjectsData()
    setProjects(projectsData.projects)
    setApps(projectsData.apps)
  }

  const handleClearFilter = () => {
    setSelectedAppFilter('all')
    setSelectedProjectFilter('all')
    router.push('/intelligence')
  }

  const handleProjectFilterChange = (projectId: string) => {
    setSelectedProjectFilter(projectId)
    setSelectedAppFilter('all') // Reset app filter when project changes

    if (projectId === 'all') {
      router.push('/intelligence')
    } else {
      router.push(`/intelligence?project=${projectId}`)
    }
  }

  const handleAppFilterChange = (appId: string) => {
    setSelectedAppFilter(appId)

    if (appId === 'all') {
      if (selectedProjectFilter !== 'all') {
        router.push(`/intelligence?project=${selectedProjectFilter}`)
      } else {
        router.push('/intelligence')
      }
    } else {
      const app = apps.find((a) => a.id === appId)
      if (app) {
        router.push(`/intelligence?app=${appId}&project=${app.projectId}`)
      }
    }
  }

  const getFilteredApps = () => {
    if (selectedProjectFilter === 'all') return apps
    return apps.filter((app) => app.projectId === selectedProjectFilter)
  }

  const handleExportData = () => {
    if (!data) return

    const exportData = {
      timeRange,
      appId,
      projectId,
      exportedAt: new Date().toISOString(),
      totalCustomers: data.totalCustomers,
      personas: data.personas,
      cravings: data.cravings,
      driftAlerts: data.driftAlerts,
      demographics: data.demographics,
      contextualPersonas: data.contextualPersonas,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `intelligence-${timeRange}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setNotification('Analytics data exported successfully!')
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp style={{ width: '16px', height: '16px', color: '#10b981' }} />
      case 'down':
        return <TrendingDown style={{ width: '16px', height: '16px', color: '#ef4444' }} />
      case 'stable':
        return <Minus style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '#10b981'
      case 'down':
        return '#ef4444'
      case 'stable':
        return '#9ca3af'
    }
  }

  const getPersonaColor = (index: number) => {
    const colors = ['#10b981', '#3b82f6', '#a78bfa', '#f59e0b', '#ec4899', '#ef4444']
    return colors[index % colors.length]
  }

  const getCravingColor = (index: number) => {
    const colors = ['#10b981', '#3b82f6', '#a78bfa', '#f59e0b', '#ec4899']
    return colors[index % colors.length]
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return '#dc2626'
      case 'High':
        return '#ef4444'
      case 'Medium':
        return '#f59e0b'
      case 'Low':
        return '#10b981'
      default:
        return '#6b7280'
    }
  }

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          Loading intelligence data...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '300px',
              }}
            >
              <Download style={{ width: '20px', height: '20px' }} />
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

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
              <Brain style={{ width: '32px', height: '32px', color: '#10b981' }} />
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
                Customer Intelligence
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Project Filter */}
              <select
                value={selectedProjectFilter}
                onChange={(e) => handleProjectFilterChange(e.target.value)}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '180px',
                }}
              >
                <option value="all">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

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
                {getFilteredApps().map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name} ({app.environment})
                  </option>
                ))}
              </select>

              {/* Clear Filter Button */}
              {(selectedProjectFilter !== 'all' || selectedAppFilter !== 'all') && (
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

              {/* Export Button */}
              <button
                onClick={handleExportData}
                style={{
                  padding: '12px 20px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  color: '#10b981',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Download style={{ width: '16px', height: '16px' }} />
                Export Data
              </button>

              {/* Time Range Filter */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ color: '#9ca3af', fontSize: '16px' }}>
              Behavioral personas, craving profiles, and drift analytics
            </p>

            {/* Active Filter Badges */}
            {selectedProjectFilter !== 'all' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(167, 139, 250, 0.1)',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  borderRadius: '8px',
                  color: '#a78bfa',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Filter style={{ width: '14px', height: '14px' }} />
                Project:{' '}
                {projects.find((p) => p.id === selectedProjectFilter)?.name ||
                  selectedProjectFilter}
              </motion.div>
            )}

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

        {/* Persona Distribution */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Users style={{ width: '20px', height: '20px', color: '#10b981' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
              Persona Distribution
            </h2>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '32px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {data.personas.map((persona, index) => (
                <motion.div
                  key={persona.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>
                        {persona.type}
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '13px' }}>
                        {persona.count.toLocaleString()} users
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {getTrendIcon(persona.trend)}
                      <span
                        style={{
                          fontSize: '12px',
                          color: getTrendColor(persona.trend),
                          fontWeight: '600',
                        }}
                      >
                        {persona.trendValue > 0 ? '+' : ''}
                        {persona.trendValue}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '8px' }}>
                    <div
                      style={{
                        height: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${persona.percentage}%`,
                          height: '100%',
                          background: getPersonaColor(index),
                          transition: 'width 0.5s',
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'right',
                      color: getPersonaColor(index),
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    {persona.percentage.toFixed(1)}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Craving Profiles */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Target style={{ width: '20px', height: '20px', color: '#a78bfa' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
              Craving Profiles
            </h2>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '32px',
            }}
          >
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              {/* Bar Chart */}
              <div style={{ flex: 1 }}>
                {data.cravings.map((craving, index) => (
                  <div key={craving.type} style={{ marginBottom: '20px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span style={{ color: 'white', fontWeight: '500' }}>{craving.type}</span>
                      <span style={{ color: getCravingColor(index), fontWeight: 'bold' }}>
                        {craving.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${craving.percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        style={{
                          height: '100%',
                          background: getCravingColor(index),
                        }}
                      />
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                      {craving.description}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Cards */}
              <div
                style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#10b981',
                      marginBottom: '4px',
                    }}
                  >
                    {data.cravings[0].percentage.toFixed(1)}%
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '13px' }}>Top Craving</div>
                  <div style={{ color: 'white', fontSize: '14px', marginTop: '4px' }}>
                    {data.cravings[0].type}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(167, 139, 250, 0.1)',
                    border: '1px solid rgba(167, 139, 250, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#a78bfa',
                      marginBottom: '4px',
                    }}
                  >
                    {data.totalCustomers.toLocaleString()}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '13px' }}>Total Analyzed</div>
                  <div style={{ color: 'white', fontSize: '14px', marginTop: '4px' }}>
                    Customers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drift Alerts */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertCircle style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>Drift Alerts</h2>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              {data.driftAlerts.length} Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.driftAlerts.map((alert) => (
              <motion.div
                key={alert.customerId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}
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
                      <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                        {alert.customerName}
                      </span>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: `${getSeverityColor(alert.severity)}20`,
                          color: getSeverityColor(alert.severity),
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px' }}>
                      {alert.previousPersona} → {alert.currentPersona} (Drift Score:{' '}
                      {(alert.driftScore * 100).toFixed(0)}%)
                    </div>
                    <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
                      <div>
                        <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>
                          Previous
                        </div>
                        <div style={{ color: '#3b82f6', fontWeight: '600' }}>
                          {alert.previousPersona}
                        </div>
                      </div>
                      <div
                        style={{
                          color: '#6b7280',
                          fontSize: '20px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        →
                      </div>
                      <div>
                        <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>
                          Current
                        </div>
                        <div style={{ color: '#a78bfa', fontWeight: '600' }}>
                          {alert.currentPersona}
                        </div>
                      </div>
                      <div style={{ marginLeft: 'auto' }}>
                        <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>
                          Drift Score
                        </div>
                        <div style={{ color: '#10b981', fontWeight: '600' }}>
                          {(alert.driftScore * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginLeft: '24px' }}>
                    <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>
                      Detected
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{alert.timestamp}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contextual Personas */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Filter style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
              Contextual Personas
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {data.contextualPersonas.map((context) => (
              <div
                key={context.context}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    color: '#9ca3af',
                    fontSize: '12px',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  {context.context}
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                  }}
                >
                  {context.persona}
                </div>
                <div style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>
                  {(context.avgConfidence * 100).toFixed(1)}% confidence
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function IntelligencePage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
        </DashboardLayout>
      }
    >
      <IntelligenceContent />
    </Suspense>
  )
}
