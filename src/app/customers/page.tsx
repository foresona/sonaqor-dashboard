'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import CustomSelect from '@/components/CustomSelect'
import {
  getCustomersData,
  getCustomerDetail,
  type Customer,
  type CustomerDetail,
} from '@/data/customers'
import {
  UserCircle,
  Search,
  Filter,
  Download,
  X,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Activity,
  Users,
  Shield,
  Brain,
  BarChart3,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // Calculate persona distribution
  const personaDistribution = customers.reduce((acc, customer) => {
    acc[customer.persona] = (acc[customer.persona] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const personaStats = Object.entries(personaDistribution).map(([name, count]) => ({
    name,
    count,
    percentage: customers.length > 0 ? (count / customers.length) * 100 : 0,
  }))

  // Calculate risk distribution
  const riskDistribution = customers.reduce((acc, customer) => {
    acc[customer.riskLevel] = (acc[customer.riskLevel] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const handleExportData = () => {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      totalCustomers: customers.length,
      personaDistribution,
      riskDistribution,
      customers: customers.map((c) => ({
        ...c,
        exportedAt: new Date().toISOString(),
      })),
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    fetchCustomers()
  }, [searchQuery, riskFilter, statusFilter])

  const fetchCustomers = async () => {
    setLoading(true)
    const filters: any = {}
    if (searchQuery) filters.search = searchQuery
    if (riskFilter !== 'All') filters.riskLevel = riskFilter
    if (statusFilter !== 'All') filters.status = statusFilter

    const data = await getCustomersData(filters)
    setCustomers(data.customers)
    setLoading(false)
  }

  const handleViewCustomer = async (customerId: string) => {
    setDetailLoading(true)
    const detail = await getCustomerDetail(customerId)
    setSelectedCustomer(detail)
    setDetailLoading(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return '#10b981'
      case 'Medium':
        return '#f59e0b'
      case 'High':
        return '#ef4444'
      case 'Critical':
        return '#dc2626'
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
      case 'Flagged':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <UserCircle style={{ width: '32px', height: '32px', color: '#10b981' }} />
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
              Customer Management
            </h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            View and manage your end-customers behavioral data • {customers.length} customers
          </p>
        </div>

        {/* Analytics Overview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Total Customers */}
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
              padding: '24px',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}
            >
              <Users style={{ width: '24px', height: '24px', color: '#10b981' }} />
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>
                Total Customers
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
              {customers.length}
            </div>
          </motion.div>

          {/* Active Customers */}
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
              padding: '24px',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}
            >
              <Activity style={{ width: '24px', height: '24px', color: '#a78bfa' }} />
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>Active</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#a78bfa' }}>
              {customers.filter((c) => c.status === 'Active').length}
            </div>
          </motion.div>

          {/* High Risk */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background:
                'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
              backdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '24px',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}
            >
              <Shield style={{ width: '24px', height: '24px', color: '#ef4444' }} />
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>
                High Risk
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>
              {customers.filter((c) => c.riskLevel === 'High' || c.riskLevel === 'Critical').length}
            </div>
          </motion.div>

          {/* Avg Confidence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              backdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '24px',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}
            >
              <Brain style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>
                Avg Confidence
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
              {customers.length > 0
                ? Math.round(
                    (customers.reduce((sum, c) => sum + c.confidence, 0) / customers.length) * 100,
                  )
                : 0}
              %
            </div>
          </motion.div>
        </div>

        {/* Persona Distribution Chart */}
        {personaStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}
            >
              <BarChart3 style={{ width: '24px', height: '24px', color: '#10b981' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                Persona Distribution
              </h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              {personaStats
                .sort((a, b) => b.count - a.count)
                .map((stat, index) => {
                  const colors = [
                    '#10b981',
                    '#a78bfa',
                    '#3b82f6',
                    '#f59e0b',
                    '#ef4444',
                    '#ec4899',
                    '#8b5cf6',
                    '#06b6d4',
                    '#84cc16',
                  ]
                  const color = colors[index % colors.length]

                  return (
                    <div
                      key={stat.name}
                      style={{
                        background: `${color}10`,
                        border: `1px solid ${color}30`,
                        borderRadius: '12px',
                        padding: '16px',
                      }}
                    >
                      <div style={{ marginBottom: '12px' }}>
                        <div
                          style={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '14px',
                            marginBottom: '4px',
                          }}
                        >
                          {stat.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ color, fontSize: '24px', fontWeight: 'bold' }}>
                            {stat.count}
                          </span>
                          <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                            ({stat.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div
                        style={{
                          height: '6px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${stat.percentage}%`,
                            height: '100%',
                            background: color,
                            borderRadius: '3px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ flex: '0 0 300px', position: 'relative' }}>
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
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Risk Filter */}
            <CustomSelect
              value={riskFilter}
              onChange={setRiskFilter}
              options={[
                { value: 'All', label: 'All Risk Levels' },
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
                { value: 'Critical', label: 'Critical' },
              ]}
              accentColor="#f59e0b"
            />

            {/* Status Filter */}
            <CustomSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Flagged', label: 'Flagged' },
              ]}
              accentColor="#10b981"
            />

            {/* Export Button */}
            <button
              onClick={handleExportData}
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
              Export
            </button>
          </div>
        </div>

        {/* Customer Table */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  Customer
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  Persona
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  Risk Level
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  Last Analysis
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  Confidence
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}
                  >
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>
                          {customer.name}
                        </div>
                        <div style={{ color: '#9ca3af', fontSize: '13px' }}>{customer.email}</div>
                        <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>
                          {customer.externalRef}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ color: '#a78bfa', fontWeight: '500' }}>
                        {customer.persona}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: `${getRiskColor(customer.riskLevel)}20`,
                          color: getRiskColor(customer.riskLevel),
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {customer.riskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: `${getStatusColor(customer.status)}20`,
                          color: getStatusColor(customer.status),
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#9ca3af', fontSize: '14px' }}>
                      {customer.lastAnalysis}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            flex: 1,
                            height: '6px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${customer.confidence * 100}%`,
                              height: '100%',
                              background: 'linear-gradient(to right, #10b981, #a78bfa)',
                            }}
                          />
                        </div>
                        <span style={{ color: '#9ca3af', fontSize: '13px', minWidth: '45px' }}>
                          {(customer.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleViewCustomer(customer.id)}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#10b981',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Customer Detail Modal */}
        <AnimatePresence>
          {selectedCustomer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
              }}
              onClick={() => setSelectedCustomer(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'rgba(17, 24, 39, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  maxWidth: '900px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  padding: '32px',
                }}
              >
                {/* Modal Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '32px',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '8px',
                      }}
                    >
                      {selectedCustomer.customer.name}
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                      {selectedCustomer.customer.email} • {selectedCustomer.customer.externalRef}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                  </button>
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
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '16px',
                      padding: '20px',
                    }}
                  >
                    <UserCircle
                      style={{
                        width: '24px',
                        height: '24px',
                        color: '#10b981',
                        marginBottom: '12px',
                      }}
                    />
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '4px',
                      }}
                    >
                      {selectedCustomer.customer.persona}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Persona Type</div>
                  </div>

                  <div
                    style={{
                      background: `${getRiskColor(selectedCustomer.customer.riskLevel)}20`,
                      border: `1px solid ${getRiskColor(selectedCustomer.customer.riskLevel)}40`,
                      borderRadius: '16px',
                      padding: '20px',
                    }}
                  >
                    <AlertTriangle
                      style={{
                        width: '24px',
                        height: '24px',
                        color: getRiskColor(selectedCustomer.customer.riskLevel),
                        marginBottom: '12px',
                      }}
                    />
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '4px',
                      }}
                    >
                      {selectedCustomer.customer.riskLevel}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Risk Level</div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(167, 139, 250, 0.1)',
                      border: '1px solid rgba(167, 139, 250, 0.2)',
                      borderRadius: '16px',
                      padding: '20px',
                    }}
                  >
                    <TrendingUp
                      style={{
                        width: '24px',
                        height: '24px',
                        color: '#a78bfa',
                        marginBottom: '12px',
                      }}
                    />
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '4px',
                      }}
                    >
                      {(selectedCustomer.customer.confidence * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Confidence</div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '16px',
                      padding: '20px',
                    }}
                  >
                    <CreditCard
                      style={{
                        width: '24px',
                        height: '24px',
                        color: '#3b82f6',
                        marginBottom: '12px',
                      }}
                    />
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '4px',
                      }}
                    >
                      {selectedCustomer.transactions.length}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Transactions</div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div style={{ marginBottom: '32px' }}>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: '16px',
                    }}
                  >
                    Recent Transactions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedCustomer.transactions.map((txn) => (
                      <div
                        key={txn.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>
                            {txn.merchantName}
                          </div>
                          <div style={{ color: '#9ca3af', fontSize: '13px' }}>
                            {txn.category} • {txn.date}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              color: txn.type === 'Credit' ? '#10b981' : '#ef4444',
                              fontWeight: 'bold',
                              fontSize: '16px',
                            }}
                          >
                            {txn.type === 'Credit' ? '+' : '-'}${txn.amount.toFixed(2)}
                          </div>
                          <div style={{ color: '#9ca3af', fontSize: '12px' }}>{txn.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Flags */}
                {selectedCustomer.riskFlags.length > 0 && (
                  <div>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '16px',
                      }}
                    >
                      Risk Flags
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {selectedCustomer.riskFlags.map((flag) => (
                        <div
                          key={flag.id}
                          style={{
                            background: `${getRiskColor(flag.severity)}10`,
                            border: `1px solid ${getRiskColor(flag.severity)}30`,
                            borderRadius: '12px',
                            padding: '16px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '8px',
                            }}
                          >
                            <AlertTriangle
                              style={{
                                width: '18px',
                                height: '18px',
                                color: getRiskColor(flag.severity),
                              }}
                            />
                            <span
                              style={{
                                color: getRiskColor(flag.severity),
                                fontWeight: '600',
                                fontSize: '14px',
                              }}
                            >
                              {flag.type}
                            </span>
                            <span
                              style={{
                                marginLeft: 'auto',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                background: `${getRiskColor(flag.severity)}20`,
                                color: getRiskColor(flag.severity),
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                            >
                              {flag.severity}
                            </span>
                          </div>
                          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
                            {flag.description}
                          </p>
                          <div style={{ color: '#6b7280', fontSize: '12px' }}>{flag.timestamp}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
