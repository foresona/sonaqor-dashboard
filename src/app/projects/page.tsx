'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  X,
  Check,
  Trash2,
  Copy,
  Search,
  Filter,
  MoreVertical,
  Eye,
  FileText,
  ChevronDown,
  Edit2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProjectsPage() {
  const router = useRouter()
  const [data, setData] = useState<ProjectsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  // Modal states
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreateApp, setShowCreateApp] = useState(false)
  const [showAppSettings, setShowAppSettings] = useState(false)
  const [showEditProject, setShowEditProject] = useState(false)
  const [selectedAppForEdit, setSelectedAppForEdit] = useState<App | null>(null)
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null)

  // Form states
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [editProject, setEditProject] = useState({ name: '', description: '' })
  const [newApp, setNewApp] = useState({
    name: '',
    environment: 'Development' as 'Production' | 'Staging' | 'Development',
    rateLimit: 100,
    ipWhitelist: '',
  })

  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterEnv, setFilterEnv] = useState<string>('All')
  const [showProjectDropdown, setShowProjectDropdown] = useState(false)
  const [showEnvFilterDropdown, setShowEnvFilterDropdown] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const fetchData = async () => {
    setLoading(true)
    const projectsData = await getProjectsData()
    setData(projectsData)
    if (projectsData.projects.length > 0) {
      setSelectedProject(projectsData.projects[0].id)
    }
    setLoading(false)
  }

  // Handlers
  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      setNotification({ type: 'error', message: 'Project name is required' })
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

    const project: Project = {
      id: String(Date.now()),
      name: newProject.name,
      description: newProject.description,
      createdAt: new Date().toISOString().split('T')[0],
      appCount: 0,
      status: 'Active',
    }

    setData((prev) =>
      prev
        ? {
            ...prev,
            projects: [...prev.projects, project],
            stats: { ...prev.stats, totalProjects: prev.stats.totalProjects + 1 },
          }
        : null,
    )

    setNotification({ type: 'success', message: 'Project created successfully!' })
    setShowCreateProject(false)
    setNewProject({ name: '', description: '' })
    setIsSubmitting(false)
    setSelectedProject(project.id)
  }

  const handleEditProject = async () => {
    if (!editProject.name.trim()) {
      setNotification({ type: 'error', message: 'Project name is required' })
      return
    }
    if (!selectedProjectForEdit) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

    setData((prev) =>
      prev
        ? {
            ...prev,
            projects: prev.projects.map((p) =>
              p.id === selectedProjectForEdit.id
                ? { ...p, name: editProject.name, description: editProject.description }
                : p,
            ),
          }
        : null,
    )

    setNotification({ type: 'success', message: 'Project updated successfully!' })
    setShowEditProject(false)
    setSelectedProjectForEdit(null)
    setEditProject({ name: '', description: '' })
    setIsSubmitting(false)
  }

  const handleCreateApp = async () => {
    if (!newApp.name.trim()) {
      setNotification({ type: 'error', message: 'App name is required' })
      return
    }
    if (!selectedProject) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const app: App = {
      id: String(Date.now()),
      projectId: selectedProject,
      name: newApp.name,
      environment: newApp.environment,
      status: 'Active',
      apiCalls: 0,
      webhooks: 0,
      lastUsed: 'Just now',
      createdAt: new Date().toISOString().split('T')[0],
      ipWhitelist: newApp.ipWhitelist
        .split(',')
        .map((ip) => ip.trim())
        .filter(Boolean),
      rateLimit: newApp.rateLimit,
    }

    setData((prev) =>
      prev
        ? {
            ...prev,
            apps: [...prev.apps, app],
            stats: {
              ...prev.stats,
              totalApps: prev.stats.totalApps + 1,
              activeApps: prev.stats.activeApps + 1,
            },
          }
        : null,
    )

    setNotification({ type: 'success', message: 'App created successfully!' })
    setShowCreateApp(false)
    setNewApp({ name: '', environment: 'Development', rateLimit: 100, ipWhitelist: '' })
    setIsSubmitting(false)
  }

  const handleUpdateApp = async () => {
    if (!selectedAppForEdit) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setData((prev) =>
      prev
        ? {
            ...prev,
            apps: prev.apps.map((app) =>
              app.id === selectedAppForEdit.id ? selectedAppForEdit : app,
            ),
          }
        : null,
    )

    setNotification({ type: 'success', message: 'App updated successfully!' })
    setShowAppSettings(false)
    setSelectedAppForEdit(null)
    setIsSubmitting(false)
  }

  const handleDeleteApp = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this app? This action cannot be undone.')) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setData((prev) =>
      prev
        ? {
            ...prev,
            apps: prev.apps.filter((app) => app.id !== appId),
            stats: {
              ...prev.stats,
              totalApps: prev.stats.totalApps - 1,
              activeApps: prev.stats.activeApps - 1,
            },
          }
        : null,
    )

    setNotification({ type: 'success', message: 'App deleted successfully!' })
    setShowAppSettings(false)
    setSelectedAppForEdit(null)
    setIsSubmitting(false)
  }

  const handleViewAnalytics = (app: App) => {
    router.push(`/intelligence?app=${app.id}&project=${selectedProject}`)
  }

  const handleViewApiKeys = (app: App) => {
    router.push(`/api-keys?app=${app.id}`)
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setNotification({ type: 'success', message: `${label} copied to clipboard!` })
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
  const projectApps = data.apps
    .filter((app) => app.projectId === selectedProject)
    .filter(
      (app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterEnv === 'All' || app.environment === filterEnv),
    )

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
                  notification.type === 'success'
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
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
              {notification.type === 'success' ? (
                <Check style={{ width: '20px', height: '20px' }} />
              ) : (
                <X style={{ width: '20px', height: '20px' }} />
              )}
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{notification.message}</span>
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
              onClick={() => setShowCreateProject(true)}
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

        {/* Project Selector */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <FolderKanban style={{ width: '20px', height: '20px', color: '#10b981' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                Select Project
              </h3>
              <div
                style={{
                  padding: '4px 12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#10b981',
                }}
              >
                {data.projects.length} {data.projects.length === 1 ? 'project' : 'projects'}
              </div>
            </div>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '20px',
              position: 'relative',
            }}
          >
            {/* Custom Dropdown */}
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {/* Project Selector Button */}
                <button
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  style={{
                    flex: 1,
                    padding: '16px 20px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
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
                    {currentProject
                      ? `${currentProject.name} (${
                          data.apps.filter((a) => a.projectId === currentProject.id).length
                        } apps)`
                      : 'Choose a project...'}
                  </span>
                  <ChevronDown
                    style={{
                      width: '20px',
                      height: '20px',
                      color: '#9ca3af',
                      transform: showProjectDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>

                {/* Settings Button */}
                {currentProject && (
                  <button
                    onClick={() => {
                      setSelectedProjectForEdit(currentProject)
                      setEditProject({
                        name: currentProject.name,
                        description: currentProject.description,
                      })
                      setShowEditProject(true)
                    }}
                    style={{
                      padding: '16px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)'
                      e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)'
                      e.currentTarget.style.color = '#10b981'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.color = '#9ca3af'
                    }}
                  >
                    <Settings style={{ width: '20px', height: '20px' }} />
                  </button>
                )}
              </div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showProjectDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
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
                      zIndex: 1000,
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {data.projects.map((project) => (
                      <div
                        key={project.id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <button
                          onClick={() => {
                            setSelectedProject(project.id)
                            setShowProjectDropdown(false)
                          }}
                          style={{
                            width: '100%',
                            padding: '16px 20px',
                            background:
                              selectedProject === project.id
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'transparent',
                            border: 'none',
                            color: selectedProject === project.id ? '#10b981' : 'white',
                            fontSize: '15px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          }}
                          onMouseEnter={(e) => {
                            if (selectedProject !== project.id) {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedProject !== project.id) {
                              e.currentTarget.style.background = 'transparent'
                            }
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FolderKanban style={{ width: '16px', height: '16px' }} />
                            <span style={{ fontWeight: '600' }}>{project.name}</span>
                            <span
                              style={{
                                marginLeft: 'auto',
                                fontSize: '12px',
                                color: '#9ca3af',
                              }}
                            >
                              {data.apps.filter((a) => a.projectId === project.id).length} apps
                            </span>
                          </div>
                          <div
                            style={{ fontSize: '12px', color: '#9ca3af', paddingLeft: '24px' }}
                          >
                            {project.description}
                          </div>
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {currentProject && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ fontSize: '14px', color: '#10b981', marginBottom: '4px' }}>
                  {currentProject.description}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  Created {currentProject.createdAt} • Status: {currentProject.status}
                </div>
              </div>
            )}
          </div>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                    Applications
                  </h2>

                  {/* Search */}
                  <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                    <Search
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        color: '#6b7280',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search apps..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 36px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  {/* Environment Filter - Custom Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowEnvFilterDropdown(!showEnvFilterDropdown)}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        minWidth: '180px',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                        e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <span>{filterEnv === 'All' ? 'All Environments' : filterEnv}</span>
                      <ChevronDown
                        style={{
                          width: '16px',
                          height: '16px',
                          color: '#9ca3af',
                          transform: showEnvFilterDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </button>

                    <AnimatePresence>
                      {showEnvFilterDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            left: 0,
                            right: 0,
                            background: 'rgba(0, 0, 0, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            zIndex: 9999,
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                          }}
                        >
                          {['All', 'Production', 'Staging', 'Development'].map((env) => (
                            <button
                              key={env}
                              onClick={() => {
                                setFilterEnv(env)
                                setShowEnvFilterDropdown(false)
                              }}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                background:
                                  filterEnv === env ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                color: filterEnv === env ? '#10b981' : 'white',
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (filterEnv !== env) {
                                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (filterEnv !== env) {
                                  e.currentTarget.style.background = 'transparent'
                                }
                              }}
                            >
                              {env === 'All' ? 'All Environments' : env}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <button
                  onClick={() => setShowCreateApp(true)}
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
                        onClick={() => {
                          setSelectedAppForEdit(app)
                          setShowAppSettings(true)
                        }}
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
                        onClick={() => handleViewAnalytics(app)}
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
                        onClick={() =>
                          router.push(
                            `/logs?app=${encodeURIComponent(
                              app.name,
                            )}&env=${app.environment.toLowerCase()}`,
                          )
                        }
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: 'rgba(168, 85, 247, 0.1)',
                          border: '1px solid rgba(168, 85, 247, 0.3)',
                          borderRadius: '8px',
                          color: '#a855f7',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <FileText style={{ width: '14px', height: '14px' }} />
                        View Logs
                      </button>
                      <button
                        onClick={() => handleViewApiKeys(app)}
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

        {/* Create Project Modal */}
        <AnimatePresence>
          {showCreateProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setShowCreateProject(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '32px',
                  maxWidth: '500px',
                  width: '90%',
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
                    Create New Project
                  </h2>
                  <button
                    onClick={() => setShowCreateProject(false)}
                    disabled={isSubmitting}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      padding: '4px',
                    }}
                  >
                    <X style={{ width: '24px', height: '24px' }} />
                  </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="e.g., Production Infrastructure"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Brief description of the project..."
                    disabled={isSubmitting}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowCreateProject(false)}
                    disabled={isSubmitting}
                    style={{
                      padding: '12px 24px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: '#9ca3af',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateProject}
                    disabled={isSubmitting || !newProject.name.trim()}
                    style={{
                      padding: '12px 24px',
                      background:
                        isSubmitting || !newProject.name.trim()
                          ? 'rgba(16, 185, 129, 0.3)'
                          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isSubmitting || !newProject.name.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Project Modal */}
        <AnimatePresence>
          {showEditProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setShowEditProject(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '32px',
                  maxWidth: '500px',
                  width: '90%',
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
                    Edit Project
                  </h2>
                  <button
                    onClick={() => setShowEditProject(false)}
                    disabled={isSubmitting}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      padding: '4px',
                    }}
                  >
                    <X style={{ width: '24px', height: '24px' }} />
                  </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={editProject.name}
                    onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
                    placeholder="e.g., Production Infrastructure"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    value={editProject.description}
                    onChange={(e) =>
                      setEditProject({ ...editProject, description: e.target.value })
                    }
                    placeholder="Brief description of the project..."
                    disabled={isSubmitting}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => {
                      setShowEditProject(false)
                      setShowDeleteConfirm(true)
                    }}
                    disabled={isSubmitting}
                    style={{
                      padding: '12px 24px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '10px',
                      color: '#ef4444',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                    Delete
                  </button>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setShowEditProject(false)}
                      disabled={isSubmitting}
                      style={{
                        padding: '12px 24px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: '#9ca3af',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditProject}
                      disabled={isSubmitting || !editProject.name.trim()}
                      style={{
                        padding: '12px 24px',
                        background:
                          isSubmitting || !editProject.name.trim()
                            ? 'rgba(16, 185, 129, 0.3)'
                            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor:
                          isSubmitting || !editProject.name.trim() ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Project'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create App Modal */}
        <AnimatePresence>
          {showCreateApp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setShowCreateApp(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '32px',
                  maxWidth: '500px',
                  width: '90%',
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
                    Create New App
                  </h2>
                  <button
                    onClick={() => setShowCreateApp(false)}
                    disabled={isSubmitting}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      padding: '4px',
                    }}
                  >
                    <X style={{ width: '24px', height: '24px' }} />
                  </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    App Name *
                  </label>
                  <input
                    type="text"
                    value={newApp.name}
                    onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                    placeholder="e.g., Main Web App"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    Environment *
                  </label>
                  <select
                    value={newApp.environment}
                    onChange={(e) => setNewApp({ ...newApp, environment: e.target.value as any })}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <option value="Development">Development</option>
                    <option value="Staging">Staging</option>
                    <option value="Production">Production</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    Rate Limit (requests/min)
                  </label>
                  <input
                    type="number"
                    value={newApp.rateLimit}
                    onChange={(e) =>
                      setNewApp({ ...newApp, rateLimit: parseInt(e.target.value) || 0 })
                    }
                    placeholder="100"
                    disabled={isSubmitting}
                    min="1"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    IP Whitelist (comma-separated)
                  </label>
                  <textarea
                    value={newApp.ipWhitelist}
                    onChange={(e) => setNewApp({ ...newApp, ipWhitelist: e.target.value })}
                    placeholder="192.168.1.1, 10.0.0.0/24"
                    disabled={isSubmitting}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowCreateApp(false)}
                    disabled={isSubmitting}
                    style={{
                      padding: '12px 24px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: '#9ca3af',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateApp}
                    disabled={isSubmitting || !newApp.name.trim()}
                    style={{
                      padding: '12px 24px',
                      background:
                        isSubmitting || !newApp.name.trim()
                          ? 'rgba(16, 185, 129, 0.3)'
                          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isSubmitting || !newApp.name.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isSubmitting ? 'Creating...' : 'Create App'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* App Settings Modal */}
        <AnimatePresence>
          {showAppSettings && selectedAppForEdit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setShowAppSettings(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '32px',
                  maxWidth: '600px',
                  width: '90%',
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
                    App Settings
                  </h2>
                  <button
                    onClick={() => setShowAppSettings(false)}
                    disabled={isSubmitting}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      padding: '4px',
                    }}
                  >
                    <X style={{ width: '24px', height: '24px' }} />
                  </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    App Name
                  </label>
                  <input
                    type="text"
                    value={selectedAppForEdit.name}
                    onChange={(e) =>
                      setSelectedAppForEdit({ ...selectedAppForEdit, name: e.target.value })
                    }
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    Environment
                  </label>
                  <select
                    value={selectedAppForEdit.environment}
                    onChange={(e) =>
                      setSelectedAppForEdit({
                        ...selectedAppForEdit,
                        environment: e.target.value as any,
                      })
                    }
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <option value="Development">Development</option>
                    <option value="Staging">Staging</option>
                    <option value="Production">Production</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    Rate Limit (requests/min)
                  </label>
                  <input
                    type="number"
                    value={selectedAppForEdit.rateLimit}
                    onChange={(e) =>
                      setSelectedAppForEdit({
                        ...selectedAppForEdit,
                        rateLimit: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={isSubmitting}
                    min="1"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    Status
                  </label>
                  <select
                    value={selectedAppForEdit.status}
                    onChange={(e) =>
                      setSelectedAppForEdit({
                        ...selectedAppForEdit,
                        status: e.target.value as any,
                      })
                    }
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    IP Whitelist
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedAppForEdit.ipWhitelist.map((ip, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={ip}
                          onChange={(e) => {
                            const newList = [...selectedAppForEdit.ipWhitelist]
                            newList[idx] = e.target.value
                            setSelectedAppForEdit({ ...selectedAppForEdit, ipWhitelist: newList })
                          }}
                          disabled={isSubmitting}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '13px',
                          }}
                        />
                        <button
                          onClick={() => {
                            const newList = selectedAppForEdit.ipWhitelist.filter(
                              (_, i) => i !== idx,
                            )
                            setSelectedAppForEdit({ ...selectedAppForEdit, ipWhitelist: newList })
                          }}
                          disabled={isSubmitting}
                          style={{
                            padding: '10px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            color: '#ef4444',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <X style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setSelectedAppForEdit({
                          ...selectedAppForEdit,
                          ipWhitelist: [...selectedAppForEdit.ipWhitelist, ''],
                        })
                      }
                      disabled={isSubmitting}
                      style={{
                        padding: '10px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#10b981',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Plus style={{ width: '16px', height: '16px' }} />
                      Add IP
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'space-between',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <button
                    onClick={() => handleDeleteApp(selectedAppForEdit.id)}
                    disabled={isSubmitting}
                    style={{
                      padding: '12px 20px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '10px',
                      color: '#ef4444',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                    Delete App
                  </button>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setShowAppSettings(false)}
                      disabled={isSubmitting}
                      style={{
                        padding: '12px 24px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: '#9ca3af',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateApp}
                      disabled={isSubmitting}
                      style={{
                        padding: '12px 24px',
                        background: isSubmitting
                          ? 'rgba(16, 185, 129, 0.3)'
                          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Project Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && selectedProjectForEdit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setShowDeleteConfirm(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '32px',
                  maxWidth: '500px',
                  width: '90%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 style={{ width: '24px', height: '24px', color: '#ef4444' }} />
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                    Delete Project
                  </h2>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <p style={{ color: '#9ca3af', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>
                    Are you sure you want to delete{' '}
                    <span style={{ color: 'white', fontWeight: '600' }}>
                      {selectedProjectForEdit.name}
                    </span>
                    ?
                  </p>
                  <div
                    style={{
                      padding: '16px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '12px',
                    }}
                  >
                    <p style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      ⚠️ Warning: This action cannot be undone!
                    </p>
                    <p style={{ color: '#fca5a5', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
                      Deleting this project will permanently remove all{' '}
                      {data?.apps.filter((a) => a.projectId === selectedProjectForEdit.id).length || 0} apps
                      associated with it, along with all their data, configurations, and API keys.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isSubmitting}
                    style={{
                      padding: '12px 24px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: '#9ca3af',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement delete project logic
                      setShowDeleteConfirm(false)
                      setNotification({
                        type: 'success',
                        message: `Project "${selectedProjectForEdit.name}" deleted successfully`,
                      })
                      setTimeout(() => setNotification(null), 3000)
                      // Reset selection if current project was deleted
                      if (selectedProject === selectedProjectForEdit.id) {
                        setSelectedProject(null)
                      }
                    }}
                    disabled={isSubmitting}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                    {isSubmitting ? 'Deleting...' : 'Delete Project'}
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
