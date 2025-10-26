'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import CustomSelect from '@/components/CustomSelect'
import { getComplianceData, type ComplianceData, type Anomaly } from '@/data/compliance'
import {
  Shield,
  AlertTriangle,
  Network,
  FileText,
  Users,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CompliancePage() {
  const [data, setData] = useState<ComplianceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [severityFilter, setSeverityFilter] = useState<string>('All')
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null)
  const [activeTab, setActiveTab] = useState<'anomalies' | 'network' | 'sar' | 'pep'>('anomalies')

  useEffect(() => {
    fetchData()
  }, [severityFilter])

  const fetchData = async () => {
    setLoading(true)
    const filters: any = {}
    if (severityFilter !== 'All') filters.severity = severityFilter
    const complianceData = await getComplianceData(filters)
    setData(complianceData)
    setLoading(false)
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

  const getTypeIcon = (type: string) => {
    return <AlertTriangle style={{ width: '18px', height: '18px' }} />
  }

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          Loading compliance data...
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
            <Shield style={{ width: '32px', height: '32px', color: '#10b981' }} />
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
              Risk & Compliance
            </h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Anomaly detection, forensic analysis, and compliance tools
          </p>
        </div>

        {/* Stats Grid */}
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
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <AlertTriangle
              style={{ width: '24px', height: '24px', color: '#ef4444', marginBottom: '12px' }}
            />
            <div
              style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}
            >
              {data.stats.totalAnomalies}
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Active Anomalies</div>
          </div>

          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <Network
              style={{ width: '24px', height: '24px', color: '#3b82f6', marginBottom: '12px' }}
            />
            <div
              style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}
            >
              {data.network.length}
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Network Nodes</div>
          </div>

          <div
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <FileText
              style={{ width: '24px', height: '24px', color: '#f59e0b', marginBottom: '12px' }}
            />
            <div
              style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}
            >
              {data.sarDrafts.length}
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>SAR Drafts</div>
          </div>

          <div
            style={{
              background: 'rgba(167, 139, 250, 0.1)',
              border: '1px solid rgba(167, 139, 250, 0.2)',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <Users
              style={{ width: '24px', height: '24px', color: '#a78bfa', marginBottom: '12px' }}
            />
            <div
              style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}
            >
              {data.stats.pepMatches}
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>PEP Matches</div>
          </div>
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
            marginBottom: '24px',
          }}
        >
          {[
            { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
            { id: 'network', label: 'Network Map', icon: Network },
            { id: 'sar', label: 'SAR Drafts', icon: FileText },
            { id: 'pep', label: 'PEP Screening', icon: Users },
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

        {/* Anomalies Tab */}
        {activeTab === 'anomalies' && (
          <div>
            {/* Filters */}
            <div
              style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}
            >
              <CustomSelect
                value={severityFilter}
                onChange={setSeverityFilter}
                options={[
                  { value: 'All', label: 'All Severities' },
                  { value: 'Critical', label: 'Critical' },
                  { value: 'High', label: 'High' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'Low', label: 'Low' },
                ]}
                accentColor="#ef4444"
              />

              <button
                style={{
                  marginLeft: 'auto',
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
                <Download style={{ width: '18px', height: '18px' }} />
                Export Report
              </button>
            </div>

            {/* Anomalies List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.anomalies.map((anomaly) => (
                <motion.div
                  key={anomaly.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                        {getTypeIcon(anomaly.type)}
                        <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                          {anomaly.type}
                        </span>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: `${getSeverityColor(anomaly.severity)}20`,
                            color: getSeverityColor(anomaly.severity),
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {anomaly.severity}
                        </span>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#3b82f6',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          Score: {(anomaly.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px' }}>
                        {anomaly.details}
                      </div>
                      <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
                        <div>
                          <span style={{ color: '#6b7280' }}>Customer: </span>
                          <span style={{ color: 'white', fontWeight: '500' }}>
                            {anomaly.customerName}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: '#6b7280' }}>Amount: </span>
                          <span style={{ color: '#10b981', fontWeight: '600' }}>
                            ${anomaly.transactionAmount?.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: '#6b7280' }}>Detected: </span>
                          <span style={{ color: '#9ca3af' }}>{anomaly.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedAnomaly(anomaly)}
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
                      <Eye style={{ width: '16px', height: '16px' }} />
                      Investigate
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Network Map Tab */}
        {activeTab === 'network' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '40px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Network
                style={{ width: '64px', height: '64px', color: '#3b82f6', margin: '0 auto 16px' }}
              />
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px',
                }}
              >
                Forensic Network Mapping
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                {data.network.length} nodes detected in relationship network
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.network.map((node) => (
                <div
                  key={node.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>
                      {node.name}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px' }}>
                      {node.transactionCount} transactions • {node.connections.length} connections
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {node.connections.map((conn, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#3b82f6',
                            fontSize: '11px',
                            fontWeight: '500',
                          }}
                        >
                          {conn}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background:
                        node.riskScore > 70
                          ? 'rgba(239, 68, 68, 0.2)'
                          : node.riskScore > 40
                          ? 'rgba(245, 158, 11, 0.2)'
                          : 'rgba(16, 185, 129, 0.2)',
                      color:
                        node.riskScore > 70
                          ? '#ef4444'
                          : node.riskScore > 40
                          ? '#f59e0b'
                          : '#10b981',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    Risk: {node.riskScore}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SAR Drafts Tab */}
        {activeTab === 'sar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.sarDrafts.map((sar) => (
              <div
                key={sar.id}
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
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                      }}
                    >
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                        {sar.customerName}
                      </h3>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background:
                            sar.status === 'Draft'
                              ? 'rgba(245, 158, 11, 0.2)'
                              : 'rgba(16, 185, 129, 0.2)',
                          color: sar.status === 'Draft' ? '#f59e0b' : '#10b981',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {sar.status}
                      </span>
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>
                      Created {sar.createdAt} • {sar.reasons.length} reasons flagged
                    </div>
                  </div>
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
                    <FileText style={{ width: '16px', height: '16px' }} />
                    View Draft
                  </button>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      color: '#6b7280',
                      fontSize: '12px',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Flagged Reasons:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {sar.reasons.map((reason, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '8px' }}>
                    AUTO-GENERATED NARRATIVE:
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', lineHeight: '1.6' }}>
                    {sar.narrative}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PEP Screening Tab */}
        {activeTab === 'pep' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.pepChecks.map((pep, index) => (
              <div
                key={index}
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
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                        {pep.name}
                      </h3>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background:
                            pep.matchType === 'Exact'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : pep.matchType === 'Partial'
                              ? 'rgba(245, 158, 11, 0.2)'
                              : 'rgba(16, 185, 129, 0.2)',
                          color:
                            pep.matchType === 'Exact'
                              ? '#ef4444'
                              : pep.matchType === 'Partial'
                              ? '#f59e0b'
                              : '#10b981',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {pep.matchType} Match
                      </span>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          color: '#6b7280',
                          fontSize: '12px',
                          marginBottom: '8px',
                          textTransform: 'uppercase',
                        }}
                      >
                        Match Details:
                      </div>
                      <div
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: '8px',
                          padding: '12px',
                        }}
                      >
                        <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>
                          Source: {pep.source}
                        </div>
                        {pep.position && pep.country && (
                          <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '4px' }}>
                            {pep.position} • {pep.country}
                          </div>
                        )}
                        <div style={{ color: '#ef4444', fontSize: '12px' }}>
                          Confidence: {(pep.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', color: '#9ca3af', fontSize: '13px' }}>
                      Last checked: {pep.checkDate}
                    </div>
                  </div>
                  <button
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      color: '#3b82f6',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Search style={{ width: '16px', height: '16px' }} />
                    Re-screen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
