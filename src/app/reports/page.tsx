'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { getReportsData, type ReportsData } from '@/data/reports'
import {
  FileBarChart,
  Download,
  Calendar,
  Clock,
  Play,
  Pause,
  Trash2,
  Plus,
  FileText,
  X,
  Check,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Activity,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'templates' | 'recent' | 'scheduled'>('templates')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showNewReportModal, setShowNewReportModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [scheduleToDelete, setScheduleToDelete] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [reportParams, setReportParams] = useState<Record<string, any>>({})
  const [scheduleParams, setScheduleParams] = useState<any>({
    frequency: 'Weekly',
    recipients: [''],
    format: 'PDF',
    startDate: '',
    time: '09:00',
  })

  const handleGenerateReport = (template: any) => {
    setSelectedTemplate(template)
    setReportParams({})
    setShowGenerateModal(true)
  }

  const handleScheduleReportModal = (template: any) => {
    setSelectedTemplate(template)
    setScheduleParams({
      frequency: 'Weekly',
      recipients: [''],
      format: 'PDF',
      startDate: '',
      time: '09:00',
    })
    setShowScheduleModal(true)
  }

  const handleSubmitSchedule = () => {
    if (!scheduleParams.startDate || !scheduleParams.recipients[0]) {
      setNotification('Please fill in all required fields')
      setTimeout(() => setNotification(null), 3000)
      return
    }

    setShowScheduleModal(false)
    setNotification(`Report "${selectedTemplate.name}" scheduled successfully`)
    setTimeout(() => setNotification(null), 3000)
    fetchData()
  }

  const handleToggleSchedule = (scheduleId: string) => {
    setNotification('Schedule status updated')
    setTimeout(() => setNotification(null), 2000)
    fetchData()
  }

  const handleDeleteSchedule = (schedule: any) => {
    setScheduleToDelete(schedule)
    setShowDeleteModal(true)
  }

  const confirmDeleteSchedule = () => {
    setNotification(`Schedule for "${scheduleToDelete.templateName}" deleted successfully`)
    setTimeout(() => setNotification(null), 2000)
    setShowDeleteModal(false)
    setScheduleToDelete(null)
    fetchData()
  }

  const addRecipient = () => {
    setScheduleParams({
      ...scheduleParams,
      recipients: [...scheduleParams.recipients, ''],
    })
  }

  const updateRecipient = (index: number, value: string) => {
    const newRecipients = [...scheduleParams.recipients]
    newRecipients[index] = value
    setScheduleParams({ ...scheduleParams, recipients: newRecipients })
  }

  const removeRecipient = (index: number) => {
    const newRecipients = scheduleParams.recipients.filter((_: any, i: number) => i !== index)
    setScheduleParams({ ...scheduleParams, recipients: newRecipients })
  }

  const handleSubmitReport = () => {
    setGenerating(true)

    setTimeout(() => {
      setGenerating(false)
      setShowGenerateModal(false)
      setNotification(`Report "${selectedTemplate.name}" is being generated`)
      setTimeout(() => setNotification(null), 3000)
      fetchData()
    }, 1500)
  }

  const handleDownloadReport = (report: any) => {
    setNotification(`Downloading ${report.name}...`)
    setTimeout(() => setNotification(null), 2000)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const reportsData = await getReportsData()
    setData(reportsData)
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#10b981'
      case 'Generating':
        return '#f59e0b'
      case 'Failed':
        return '#ef4444'
      case 'Scheduled':
        return '#3b82f6'
      default:
        return '#6b7280'
    }
  }

  const getFormatColor = (format: string) => {
    const colors: any = {
      CSV: '#10b981',
      Excel: '#059669',
      PDF: '#ef4444',
      JSON: '#3b82f6',
    }
    return colors[format] || '#6b7280'
  }

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          Loading reports...
        </div>
      </DashboardLayout>
    )
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
              <FileBarChart style={{ width: '32px', height: '32px', color: '#10b981' }} />
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
                Reports & Exports
              </h1>
            </div>

            <button
              onClick={() => setShowNewReportModal(true)}
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
              New Report
            </button>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Generate reports and schedule automated exports
          </p>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'fixed',
                top: '24px',
                right: '24px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Check style={{ width: '20px', height: '20px' }} />
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analytics Overview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background:
                'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              backdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              padding: '20px',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}
            >
              <FileText style={{ width: '20px', height: '20px', color: '#10b981' }} />
              <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '500' }}>
                Total Reports
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
              {data.reports.length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background:
                'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%)',
              backdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: '1px solid rgba(167, 139, 250, 0.2)',
              padding: '20px',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}
            >
              <Clock style={{ width: '20px', height: '20px', color: '#a78bfa' }} />
              <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '500' }}>
                Scheduled
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#a78bfa' }}>
              {data.schedules.filter((s) => s.active).length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              backdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '20px',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}
            >
              <BarChart3 style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
              <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '500' }}>
                Templates
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
              {data.templates.length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background:
                'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
              backdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              padding: '20px',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}
            >
              <Download style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
              <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '500' }}>
                This Month
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
              {data.reports.filter((r) => r.status === 'Completed').length}
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
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
          {[
            { id: 'templates', label: 'Templates', icon: FileText },
            { id: 'recent', label: 'Recent Reports', icon: Clock },
            { id: 'scheduled', label: 'Scheduled', icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: activeTab === tab.id ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                border:
                  activeTab === tab.id
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid transparent',
                borderRadius: '12px',
                color: activeTab === tab.id ? '#10b981' : '#9ca3af',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
            >
              <tab.icon style={{ width: '18px', height: '18px' }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {data.templates.map((template, index) => (
              <motion.div
                key={template.id}
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
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '8px',
                      }}
                    >
                      {template.name}
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px' }}>
                      {template.description}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}
                      >
                        {template.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Parameters */}
                {template.parameters.length > 0 && (
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
                        color: '#6b7280',
                        fontSize: '11px',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Parameters:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {template.parameters.map((param, idx) => (
                        <div
                          key={idx}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: '#10b981',
                            }}
                          />
                          <span style={{ color: '#9ca3af', fontSize: '13px' }}>{param.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleGenerateReport(template)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#10b981',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Play style={{ width: '14px', height: '14px' }} />
                    Generate
                  </button>
                  <button
                    onClick={() => handleScheduleReportModal(template)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      color: '#3b82f6',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Calendar style={{ width: '14px', height: '14px' }} />
                    Schedule
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recent Reports Tab */}
        {activeTab === 'recent' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.reports.map((report) => (
              <div
                key={report.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                      }}
                    >
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                        {report.name}
                      </h3>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: `${getStatusColor(report.status)}20`,
                          color: getStatusColor(report.status),
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {report.status}
                      </span>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: `${getFormatColor(report.format)}20`,
                          color: getFormatColor(report.format),
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {report.format}
                      </span>
                    </div>
                    <div
                      style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#9ca3af' }}
                    >
                      <div>
                        <span style={{ color: '#6b7280' }}>Generated: </span>
                        {report.createdAt}
                      </div>
                      {report.size && (
                        <div>
                          <span style={{ color: '#6b7280' }}>Size: </span>
                          {report.size}
                        </div>
                      )}
                    </div>
                  </div>
                  {report.status === 'Completed' && (
                    <button
                      onClick={() => handleDownloadReport(report)}
                      style={{
                        padding: '10px 20px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#10b981',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Download style={{ width: '16px', height: '16px' }} />
                      Download
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scheduled Reports Tab */}
        {activeTab === 'scheduled' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.schedules.map((schedule) => (
              <div
                key={schedule.id}
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
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                        {schedule.templateName}
                      </h3>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: schedule.active
                            ? 'rgba(16, 185, 129, 0.2)'
                            : 'rgba(107, 114, 128, 0.2)',
                          color: schedule.active ? '#10b981' : '#6b7280',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {schedule.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ fontSize: '13px' }}>
                        <span style={{ color: '#6b7280' }}>Frequency: </span>
                        <span style={{ color: 'white', fontWeight: '500' }}>
                          {schedule.frequency}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px' }}>
                        <span style={{ color: '#6b7280' }}>Format: </span>
                        <span style={{ color: 'white', fontWeight: '500' }}>{schedule.format}</span>
                      </div>
                      <div style={{ fontSize: '13px' }}>
                        <span style={{ color: '#6b7280' }}>Recipients: </span>
                        <span style={{ color: 'white', fontWeight: '500' }}>
                          {schedule.recipients.join(', ')}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px' }}>
                        <span style={{ color: '#6b7280' }}>Next run: </span>
                        <span style={{ color: '#10b981', fontWeight: '500' }}>
                          {schedule.nextRun}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleSchedule(schedule.id)}
                      style={{
                        padding: '8px 16px',
                        background: schedule.active
                          ? 'rgba(245, 158, 11, 0.1)'
                          : 'rgba(16, 185, 129, 0.1)',
                        border: schedule.active
                          ? '1px solid rgba(245, 158, 11, 0.3)'
                          : '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        color: schedule.active ? '#f59e0b' : '#10b981',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {schedule.active ? (
                        <>
                          <Pause style={{ width: '14px', height: '14px' }} />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play style={{ width: '14px', height: '14px' }} />
                          Resume
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteSchedule(schedule)}
                      style={{
                        padding: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Generate Report Modal */}
        <AnimatePresence>
          {showGenerateModal && selectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !generating && setShowGenerateModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '32px',
                  maxWidth: '600px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                }}
              >
                {/* Modal Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                  }}
                >
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                    Generate Report
                  </h2>
                  <button
                    onClick={() => !generating && setShowGenerateModal(false)}
                    disabled={generating}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px',
                      cursor: generating ? 'not-allowed' : 'pointer',
                      opacity: generating ? 0.5 : 1,
                    }}
                  >
                    <X style={{ width: '20px', height: '20px', color: 'white' }} />
                  </button>
                </div>

                {/* Template Info */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#10b981',
                      marginBottom: '8px',
                    }}
                  >
                    {selectedTemplate.name}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px' }}>
                    {selectedTemplate.description}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {selectedTemplate.type}
                    </span>
                    <span style={{ color: '#6b7280', fontSize: '13px' }}>
                      ⏱ {selectedTemplate.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Parameters Form */}
                <div style={{ marginBottom: '24px' }}>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '16px',
                    }}
                  >
                    Report Parameters
                  </div>

                  {selectedTemplate.parameters.map((param: any, idx: number) => (
                    <div key={idx} style={{ marginBottom: '16px' }}>
                      <label
                        style={{
                          display: 'block',
                          color: '#9ca3af',
                          fontSize: '14px',
                          marginBottom: '8px',
                        }}
                      >
                        {param.name} {param.required && <span style={{ color: '#ef4444' }}>*</span>}
                      </label>

                      {param.type === 'date' && (
                        <input
                          type="date"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                            outline: 'none',
                          }}
                        />
                      )}

                      {param.type === 'select' && param.options && (
                        <select
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="">Select {param.name}</option>
                          {param.options.map((opt: string) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {param.type === 'multiselect' && param.options && (
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '12px',
                            maxHeight: '150px',
                            overflow: 'auto',
                          }}
                        >
                          {param.options.map((opt: string) => (
                            <label
                              key={opt}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px',
                                cursor: 'pointer',
                              }}
                            >
                              <input type="checkbox" style={{ cursor: 'pointer' }} />
                              <span style={{ color: 'white', fontSize: '14px' }}>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Export Format */}
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        color: '#9ca3af',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      Export Format <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}
                    >
                      {['CSV', 'Excel', 'PDF', 'JSON'].map((format) => (
                        <button
                          key={format}
                          style={{
                            padding: '12px',
                            background:
                              reportParams.format === format
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(255, 255, 255, 0.05)',
                            border:
                              reportParams.format === format
                                ? '1px solid rgba(16, 185, 129, 0.3)'
                                : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: reportParams.format === format ? '#10b981' : '#9ca3af',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                          onClick={() => setReportParams({ ...reportParams, format })}
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    disabled={generating}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: generating ? 'not-allowed' : 'pointer',
                      opacity: generating ? 0.5 : 1,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReport}
                    disabled={generating}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: generating
                        ? 'rgba(107, 114, 128, 0.5)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: generating ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {generating ? (
                      <>
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }}
                        />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play style={{ width: '18px', height: '18px' }} />
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Schedule Report Modal */}
        <AnimatePresence>
          {showScheduleModal && selectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScheduleModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '32px',
                  maxWidth: '600px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                }}
              >
                {/* Modal Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                  }}
                >
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                    Schedule Report
                  </h2>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <X style={{ width: '20px', height: '20px', color: 'white' }} />
                  </button>
                </div>

                {/* Template Info */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                      marginBottom: '8px',
                    }}
                  >
                    {selectedTemplate.name}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                    {selectedTemplate.description}
                  </div>
                </div>

                {/* Schedule Form */}
                <div style={{ marginBottom: '24px' }}>
                  {/* Frequency */}
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        color: '#9ca3af',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      Frequency <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={scheduleParams.frequency}
                      onChange={(e) =>
                        setScheduleParams({ ...scheduleParams, frequency: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        color: '#9ca3af',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      Start Date <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={scheduleParams.startDate}
                      onChange={(e) =>
                        setScheduleParams({ ...scheduleParams, startDate: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Time */}
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        color: '#9ca3af',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      Time <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="time"
                      value={scheduleParams.time}
                      onChange={(e) =>
                        setScheduleParams({ ...scheduleParams, time: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Recipients */}
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <label style={{ color: '#9ca3af', fontSize: '14px' }}>
                        Recipients <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <button
                        onClick={addRecipient}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '6px',
                          color: '#3b82f6',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Plus style={{ width: '14px', height: '14px' }} />
                        Add
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {scheduleParams.recipients.map((email: string, index: number) => (
                        <div
                          key={index}
                          style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                        >
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => updateRecipient(index, e.target.value)}
                            placeholder="email@example.com"
                            style={{
                              flex: 1,
                              padding: '12px 16px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              color: 'white',
                              fontSize: '14px',
                              outline: 'none',
                            }}
                          />
                          {scheduleParams.recipients.length > 1 && (
                            <button
                              onClick={() => removeRecipient(index)}
                              style={{
                                padding: '12px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                color: '#ef4444',
                                cursor: 'pointer',
                              }}
                            >
                              <X style={{ width: '16px', height: '16px' }} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export Format */}
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        color: '#9ca3af',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      Export Format <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}
                    >
                      {['CSV', 'Excel', 'PDF', 'JSON'].map((format) => (
                        <button
                          key={format}
                          onClick={() => setScheduleParams({ ...scheduleParams, format })}
                          style={{
                            padding: '12px',
                            background:
                              scheduleParams.format === format
                                ? 'rgba(59, 130, 246, 0.2)'
                                : 'rgba(255, 255, 255, 0.05)',
                            border:
                              scheduleParams.format === format
                                ? '1px solid rgba(59, 130, 246, 0.3)'
                                : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: scheduleParams.format === format ? '#3b82f6' : '#9ca3af',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitSchedule}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <Calendar style={{ width: '18px', height: '18px' }} />
                    Schedule Report
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && scheduleToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '32px',
                  maxWidth: '480px',
                  width: '100%',
                }}
              >
                {/* Warning Icon */}
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
                    margin: '0 auto 24px',
                  }}
                >
                  <Trash2 style={{ width: '32px', height: '32px', color: '#ef4444' }} />
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: '12px',
                  }}
                >
                  Delete Schedule?
                </h2>

                {/* Message */}
                <p
                  style={{
                    color: '#9ca3af',
                    fontSize: '15px',
                    textAlign: 'center',
                    marginBottom: '24px',
                    lineHeight: '1.6',
                  }}
                >
                  Are you sure you want to delete the schedule for{' '}
                  <strong style={{ color: 'white' }}>"{scheduleToDelete.templateName}"</strong>?
                  <br />
                  This action cannot be undone.
                </p>

                {/* Schedule Info */}
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9ca3af', fontSize: '13px' }}>Frequency:</span>
                      <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
                        {scheduleToDelete.frequency}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9ca3af', fontSize: '13px' }}>Recipients:</span>
                      <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
                        {scheduleToDelete.recipients.length} recipient(s)
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9ca3af', fontSize: '13px' }}>Next Run:</span>
                      <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
                        {scheduleToDelete.nextRun}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteSchedule}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <Trash2 style={{ width: '18px', height: '18px' }} />
                    Delete Schedule
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Report Modal - Template Selector */}
        <AnimatePresence>
          {showNewReportModal && data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewReportModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '32px',
                  maxWidth: '900px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                }}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                      Create New Report
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                      Select a template to generate or schedule a report
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNewReportModal(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <X style={{ width: '20px', height: '20px', color: 'white' }} />
                  </button>
                </div>

                {/* Template Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {data.templates.map((template) => {
                    const typeColors: Record<string, string> = {
                      Usage: '#10b981',
                      Personas: '#a78bfa',
                      Anomalies: '#ef4444',
                      Compliance: '#3b82f6',
                      Financial: '#f59e0b',
                      Custom: '#ec4899',
                    }
                    const color = typeColors[template.type] || '#6b7280'

                    return (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          padding: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: `${color}20`,
                                border: `1px solid ${color}40`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <FileText style={{ width: '20px', height: '20px', color }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                                {template.name}
                              </h3>
                              <span
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  background: `${color}20`,
                                  color,
                                  fontSize: '11px',
                                  fontWeight: '600',
                                }}
                              >
                                {template.type}
                              </span>
                            </div>
                          </div>
                          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '12px', lineHeight: '1.5' }}>
                            {template.description}
                          </p>
                          <div style={{ color: '#6b7280', fontSize: '12px' }}>
                            ⏱ {template.estimatedTime}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowNewReportModal(false)
                              handleGenerateReport(template)
                            }}
                            style={{
                              flex: 1,
                              padding: '10px',
                              background: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: '8px',
                              color: '#10b981',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                          >
                            <Play style={{ width: '14px', height: '14px' }} />
                            Generate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowNewReportModal(false)
                              handleScheduleReportModal(template)
                            }}
                            style={{
                              flex: 1,
                              padding: '10px',
                              background: 'rgba(59, 130, 246, 0.1)',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '8px',
                              color: '#3b82f6',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                          >
                            <Calendar style={{ width: '14px', height: '14px' }} />
                            Schedule
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
