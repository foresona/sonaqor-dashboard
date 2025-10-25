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
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'templates' | 'recent' | 'scheduled'>('templates')

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
      </div>
    </DashboardLayout>
  )
}
