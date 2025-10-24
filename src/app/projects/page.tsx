'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { getProjectsData, type ProjectsData, type Project, type App } from '@/data/projects'
import {
  FolderKanban,
  Plus,
  Settings,
  Activity,
  Globe,
  Lock,
  Clock,
  TrendingUp,
  BarChart3,
  Code,
  Database,
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProjectsPage() {
  const [data, setData] = useState<ProjectsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const projectsData = await getProjectsData()
    setData(projectsData)
    if (projectsData.projects.length > 0) {
      setSelectedProject(projectsData.projects[0].id)
    }
    setLoading(false)
  }

  const getEnvColor = (env: string) => {
    switch (env) {
      case 'Production':
        return '#10b981'
      case 'Staging':
        return '#f59e0b'
      case 'Development':
        return '#3b82f6'
      default:
        return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#10b981'
      case 'Inactive':
        return '#6b7280'
      case 'Suspended':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          Loading projects...
        </div>
      </DashboardLayout>
    )
  }

  const currentProject = data.projects.find((p) => p.id === selectedProject)
  const projectApps = data.apps.filter((app) => app.projectId === selectedProject)

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
              <FolderKanban style={{ width: '32px', height: '32px', color: '#10b981' }} />
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
                Projects & Apps
              </h1>
            </div>

            <button
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
              New Project
            </button>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Manage your projects and applications • {data.projects.length} projects,{' '}
            {data.apps.length} apps
          </p>
        </div>

        {/* Projects Tabs */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '8px',
            display: 'flex',
            gap: '8px',
            marginBottom: '32px',
          }}
        >
          {data.projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              style={{
                flex: 1,
                padding: '16px 20px',
                background:
                  selectedProject === project.id ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                border:
                  selectedProject === project.id
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid transparent',
                borderRadius: '12px',
                color: selectedProject === project.id ? '#10b981' : '#9ca3af',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
            >
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                {project.name}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                {data.apps.filter((a) => a.projectId === project.id).length} apps
              </div>
            </button>
          ))}
        </div>

        {currentProject && (
          <>
            {/* Project Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '16px',
                  padding: '20px',
                }}
              >
                <Activity
                  style={{ width: '24px', height: '24px', color: '#3b82f6', marginBottom: '12px' }}
                />
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '4px',
                  }}
                >
                  {data.stats.totalApiCalls.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>API Calls (30d)</div>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '16px',
                  padding: '20px',
                }}
              >
                <Code
                  style={{ width: '24px', height: '24px', color: '#10b981', marginBottom: '12px' }}
                />
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '4px',
                  }}
                >
                  {projectApps.length}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Active Apps</div>
              </div>

              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '16px',
                  padding: '20px',
                }}
              >
                <TrendingUp
                  style={{ width: '24px', height: '24px', color: '#f59e0b', marginBottom: '12px' }}
                />
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '4px',
                  }}
                >
                  99.8%
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Success Rate</div>
              </div>

              <div
                style={{
                  background: 'rgba(167, 139, 250, 0.1)',
                  border: '1px solid rgba(167, 139, 250, 0.2)',
                  borderRadius: '16px',
                  padding: '20px',
                }}
              >
                <Clock
                  style={{ width: '24px', height: '24px', color: '#a78bfa', marginBottom: '12px' }}
                />
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '4px',
                  }}
                >
                  145ms
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Avg Latency</div>
              </div>
            </div>

            {/* Apps Section */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                  Applications
                </h2>
                <button
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    color: '#10b981',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Plus style={{ width: '16px', height: '16px' }} />
                  New App
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {projectApps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '24px',
                    }}
                  >
                    {/* App Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                          }}
                        >
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                            {app.name}
                          </h3>
                          <span
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: `${getEnvColor(app.environment)}20`,
                              color: getEnvColor(app.environment),
                              fontSize: '11px',
                              fontWeight: '600',
                            }}
                          >
                            {app.environment}
                          </span>
                        </div>
                        <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '4px' }}>
                          {app.webhooks} webhooks • {app.ipWhitelist.length} IPs whitelisted
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '8px',
                          }}
                        >
                          <span
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: `${getStatusColor(app.status)}20`,
                              color: getStatusColor(app.status),
                              fontSize: '11px',
                              fontWeight: '600',
                            }}
                          >
                            {app.status}
                          </span>
                          <span style={{ color: '#6b7280', fontSize: '12px' }}>
                            • Created {app.createdAt}
                          </span>
                        </div>
                      </div>
                      <button
                        style={{
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#9ca3af',
                          cursor: 'pointer',
                        }}
                      >
                        <Settings style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>

                    {/* App Metrics */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '16px',
                        }}
                      >
                        <div>
                          <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>
                            API CALLS
                          </div>
                          <div style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold' }}>
                            {app.apiCalls.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>
                            WEBHOOKS
                          </div>
                          <div style={{ color: '#3b82f6', fontSize: '18px', fontWeight: 'bold' }}>
                            {app.webhooks}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>
                            RATE LIMIT
                          </div>
                          <div style={{ color: '#a78bfa', fontSize: '18px', fontWeight: 'bold' }}>
                            {app.rateLimit}/min
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Configuration */}
                    <div style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          color: '#6b7280',
                          fontSize: '11px',
                          marginBottom: '8px',
                          textTransform: 'uppercase',
                        }}
                      >
                        Configuration
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '13px',
                          }}
                        >
                          <span style={{ color: '#9ca3af' }}>Rate Limit:</span>
                          <span style={{ color: 'white', fontWeight: '500' }}>
                            {app.rateLimit}/min
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '13px',
                          }}
                        >
                          <span style={{ color: '#9ca3af' }}>IP Whitelist:</span>
                          <span style={{ color: 'white', fontWeight: '500' }}>
                            {app.ipWhitelist.length} IPs
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '13px',
                          }}
                        >
                          <span style={{ color: '#9ca3af' }}>Last Activity:</span>
                          <span style={{ color: 'white', fontWeight: '500' }}>{app.lastUsed}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <button
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#10b981',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <BarChart3 style={{ width: '14px', height: '14px' }} />
                        View Analytics
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                          color: '#3b82f6',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <Database style={{ width: '14px', height: '14px' }} />
                        API Keys
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
