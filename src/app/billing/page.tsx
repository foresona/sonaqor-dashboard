'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { getBillingData, type BillingData } from '@/data/billing'
import {
  CreditCard,
  Check,
  Download,
  AlertTriangle,
  TrendingUp,
  Calendar,
  DollarSign,
  Plus,
  X,
  Trash2,
  Star,
  Bell,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BillingPage() {
  const [data, setData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'usage'>('overview')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const handleUpgradePlan = (plan: any) => {
    setSelectedPlan(plan)
    setShowUpgradeModal(true)
  }

  const handleConfirmUpgrade = () => {
    setShowUpgradeModal(false)
    setNotification(`Successfully upgraded to ${selectedPlan.name} plan!`)
    setTimeout(() => setNotification(null), 3000)
    fetchData()
  }

  const handleAddPaymentMethod = () => {
    setShowPaymentModal(false)
    setNotification('Payment method added successfully!')
    setTimeout(() => setNotification(null), 3000)
    fetchData()
  }

  const handleSetDefaultPayment = (methodId: string) => {
    setNotification('Default payment method updated!')
    setTimeout(() => setNotification(null), 3000)
    // In a real app, this would update the backend
    fetchData()
  }

  const handleDeletePaymentMethod = (methodId: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      setNotification('Payment method deleted successfully!')
      setTimeout(() => setNotification(null), 3000)
      // In a real app, this would call the backend to delete
      fetchData()
    }
  }

  const handleConfigureAlerts = () => {
    setShowAlertModal(true)
  }

  const handleSaveAlerts = () => {
    setShowAlertModal(false)
    setNotification('Alert settings saved successfully!')
    setTimeout(() => setNotification(null), 3000)
    fetchData()
  }

  const handleDownloadInvoice = (invoice: any) => {
    setNotification(`Downloading invoice ${invoice.id}...`)
    setTimeout(() => setNotification(null), 2000)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const billingData = await getBillingData()
    setData(billingData)
    setLoading(false)
  }

  const getPlanColor = (planName: string) => {
    const colors: any = {
      Free: '#6b7280',
      Starter: '#10b981',
      Pro: '#3b82f6',
      Enterprise: '#a78bfa',
    }
    return colors[planName] || '#6b7280'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return '#10b981'
      case 'Pending':
        return '#f59e0b'
      case 'Overdue':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          Loading billing information...
        </div>
      </DashboardLayout>
    )
  }

  const currentPlan = data.currentPlan!

  return (
    <DashboardLayout>
      <div style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <CreditCard style={{ width: '32px', height: '32px', color: '#10b981' }} />
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
              Billing & Account
            </h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Manage your subscription, usage, and billing information
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
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'invoices', label: 'Invoices', icon: DollarSign },
            { id: 'usage', label: 'Usage', icon: Calendar },
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Current Plan */}
            <div style={{ marginBottom: '32px' }}>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '16px',
                }}
              >
                Current Plan
              </h2>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: `2px solid ${getPlanColor(currentPlan.name)}40`,
                  padding: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: getPlanColor(currentPlan.name),
                        marginBottom: '8px',
                      }}
                    >
                      {currentPlan.name}
                    </h3>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '4px',
                      }}
                    >
                      ${currentPlan.pricing.monthly}
                      <span style={{ fontSize: '16px', color: '#9ca3af', fontWeight: 'normal' }}>
                        /month
                      </span>
                    </div>
                    {data.nextBillingDate && (
                      <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                        Renews on {data.nextBillingDate}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    style={{
                      padding: '12px 24px',
                      background: `${getPlanColor(currentPlan.name)}20`,
                      border: `1px solid ${getPlanColor(currentPlan.name)}40`,
                      borderRadius: '8px',
                      color: getPlanColor(currentPlan.name),
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Upgrade Plan
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Check style={{ width: '18px', height: '18px', color: '#10b981' }} />
                      <span style={{ color: '#e5e7eb', fontSize: '14px' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div style={{ marginTop: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                  Payment Methods
                </h2>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '8px',
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
                  Add Payment Method
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {data.paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      border: method.isDefault ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <CreditCard style={{ width: '32px', height: '32px', color: '#10b981' }} />
                      {method.isDefault && (
                        <span style={{
                          padding: '4px 10px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          borderRadius: '6px',
                          color: '#10b981',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}>
                          DEFAULT
                        </span>
                      )}
                    </div>
                    
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                      {method.type === 'card' ? 'Credit Card' : 'Bank Account'} •••• {method.last4}
                    </div>
                    
                    {method.expiryDate && (
                      <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px' }}>
                        Expires {method.expiryDate}
                      </div>
                    )}
                    
                    {method.bankName && (
                      <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px' }}>
                        {method.bankName}
                      </div>
                    )}
                    
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>
                      Added {method.addedAt}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      {!method.isDefault && (
                        <button 
                          onClick={() => handleSetDefaultPayment(method.id)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '6px',
                            color: '#3b82f6',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          Set Default
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        style={{
                          padding: '8px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '6px',
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Alerts */}
            {data.alerts && data.alerts.length > 0 && (
              <div style={{ marginTop: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                    Usage Alerts
                  </h2>
                  <button
                    onClick={() => setShowAlertModal(true)}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      color: '#3b82f6',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Bell style={{ width: '18px', height: '18px' }} />
                    Configure Alerts
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {data.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      style={{
                        background: alert.severity === 'Critical' 
                          ? 'rgba(239, 68, 68, 0.1)' 
                          : 'rgba(245, 158, 11, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: alert.severity === 'Critical'
                          ? '1px solid rgba(239, 68, 68, 0.3)'
                          : '1px solid rgba(245, 158, 11, 0.3)',
                        padding: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                        <AlertTriangle 
                          style={{ 
                            width: '24px', 
                            height: '24px', 
                            color: alert.severity === 'Critical' ? '#ef4444' : '#f59e0b',
                            marginTop: '2px',
                            flexShrink: 0,
                          }} 
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ 
                              color: 'white', 
                              fontSize: '16px', 
                              fontWeight: '600',
                            }}>
                              {alert.metric} Usage Alert
                            </span>
                            <span style={{
                              padding: '3px 10px',
                              background: alert.severity === 'Critical' ? '#ef4444' : '#f59e0b',
                              borderRadius: '6px',
                              color: 'white',
                              fontSize: '11px',
                              fontWeight: '700',
                            }}>
                              {alert.severity}
                            </span>
                          </div>
                          <div style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '8px' }}>
                            You've used {alert.currentUsage.toLocaleString()} of {alert.limit.toLocaleString()} ({alert.percentage}%)
                          </div>
                          <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                            {alert.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.invoices.map((invoice) => (
              <div
                key={invoice.id}
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
                        Invoice #{invoice.id}
                      </h3>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: `${getStatusColor(invoice.status)}20`,
                          color: getStatusColor(invoice.status),
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <div
                      style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#9ca3af' }}
                    >
                      <div>
                        <span style={{ color: '#6b7280' }}>Date: </span>
                        {invoice.date}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                        ${invoice.amount}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {invoice.status === 'Paid' ? `Paid on ${invoice.date}` : 'Unpaid'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadInvoice(invoice)}
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && data.usage && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px',
                }}
              >
                Current Billing Period
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                {data.billingCycle} billing cycle
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '4px',
                        }}
                      >
                        API Calls
                      </h3>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                        {data.usage.apiCalls.current.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${data.usage.apiCalls.percentage}%`,
                        background:
                          data.usage.apiCalls.percentage > 80
                            ? 'linear-gradient(to right, #f59e0b, #d97706)'
                            : 'linear-gradient(to right, #10b981, #059669)',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>

                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}
                  >
                    <span style={{ color: '#9ca3af' }}>
                      Limit: {data.usage.apiCalls.limit.toLocaleString()}
                    </span>
                    <span style={{ color: '#9ca3af', fontWeight: '600' }}>
                      {data.usage.apiCalls.percentage}%
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '4px',
                        }}
                      >
                        Customers
                      </h3>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                        {data.usage.customers.current.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${data.usage.customers.percentage}%`,
                        background:
                          data.usage.customers.percentage > 80
                            ? 'linear-gradient(to right, #f59e0b, #d97706)'
                            : 'linear-gradient(to right, #10b981, #059669)',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>

                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}
                  >
                    <span style={{ color: '#9ca3af' }}>
                      Limit: {data.usage.customers.limit.toLocaleString()}
                    </span>
                    <span style={{ color: '#9ca3af', fontWeight: '600' }}>
                      {data.usage.customers.percentage}%
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '4px',
                        }}
                      >
                        Storage
                      </h3>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                        {data.usage.storage.current}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${data.usage.storage.percentage}%`,
                        background:
                          data.usage.storage.percentage > 80
                            ? 'linear-gradient(to right, #f59e0b, #d97706)'
                            : 'linear-gradient(to right, #10b981, #059669)',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>

                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}
                  >
                    <span style={{ color: '#9ca3af' }}>Limit: {data.usage.storage.limit}</span>
                    <span style={{ color: '#9ca3af', fontWeight: '600' }}>
                      {data.usage.storage.percentage}%
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '4px',
                        }}
                      >
                        Bandwidth
                      </h3>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                        {data.usage.bandwidth.current}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${data.usage.bandwidth.percentage}%`,
                        background:
                          data.usage.bandwidth.percentage > 80
                            ? 'linear-gradient(to right, #f59e0b, #d97706)'
                            : 'linear-gradient(to right, #10b981, #059669)',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>

                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}
                  >
                    <span style={{ color: '#9ca3af' }}>Limit: {data.usage.bandwidth.limit}</span>
                    <span style={{ color: '#9ca3af', fontWeight: '600' }}>
                      {data.usage.bandwidth.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Plan Modal */}
        <AnimatePresence>
          {showUpgradeModal && data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
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
                  maxWidth: '1000px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                }}
              >
                {/* Modal Header */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                      Choose Your Plan
                    </h2>
                    <button
                      onClick={() => setShowUpgradeModal(false)}
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
                  
                  {/* Billing Cycle Toggle */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      style={{
                        padding: '10px 20px',
                        background: billingCycle === 'monthly' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: billingCycle === 'monthly' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: billingCycle === 'monthly' ? '#10b981' : '#9ca3af',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle('yearly')}
                      style={{
                        padding: '10px 20px',
                        background: billingCycle === 'yearly' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: billingCycle === 'yearly' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: billingCycle === 'yearly' ? '#10b981' : '#9ca3af',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      Yearly
                      <span style={{ padding: '2px 8px', background: '#10b981', color: 'white', borderRadius: '4px', fontSize: '11px' }}>
                        Save 20%
                      </span>
                    </button>
                  </div>
                </div>

                {/* Plans Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  {data.availablePlans.map((plan) => {
                    const isCurrentPlan = plan.name === data.currentPlan.name
                    const color = getPlanColor(plan.name)
                    const price = billingCycle === 'monthly' ? plan.pricing.monthly : Math.floor(plan.pricing.yearly / 12)

                    return (
                      <motion.div
                        key={plan.name}
                        whileHover={{ scale: isCurrentPlan ? 1 : 1.02 }}
                        style={{
                          background: isCurrentPlan 
                            ? `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`
                            : 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '16px',
                          border: isCurrentPlan ? `2px solid ${color}` : '1px solid rgba(255, 255, 255, 0.1)',
                          padding: '24px',
                          position: 'relative',
                        }}
                      >
                        {isCurrentPlan && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            padding: '4px 12px',
                            background: color,
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '700',
                          }}>
                            CURRENT
                          </div>
                        )}

                        {plan.name === 'Pro' && (
                          <div style={{
                            position: 'absolute',
                            top: '-12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '4px 16px',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            <Star style={{ width: '12px', height: '12px' }} />
                            POPULAR
                          </div>
                        )}

                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color, marginBottom: '12px', marginTop: isCurrentPlan ? '24px' : '0' }}>
                          {plan.name}
                        </h3>

                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>
                            ${price}
                          </div>
                          <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                            per month {billingCycle === 'yearly' && '(billed yearly)'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#9ca3af', marginBottom: '4px' }}>
                            LIMITS
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ color: '#9ca3af' }}>API Calls</span>
                            <span style={{ color: 'white', fontWeight: '600' }}>
                              {plan.limits.apiCalls === -1 ? 'Unlimited' : plan.limits.apiCalls.toLocaleString()}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ color: '#9ca3af' }}>Customers</span>
                            <span style={{ color: 'white', fontWeight: '600' }}>
                              {plan.limits.customers === -1 ? 'Unlimited' : plan.limits.customers.toLocaleString()}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ color: '#9ca3af' }}>Storage</span>
                            <span style={{ color: 'white', fontWeight: '600' }}>{plan.limits.storage}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ color: '#9ca3af' }}>Team Members</span>
                            <span style={{ color: 'white', fontWeight: '600' }}>
                              {plan.limits.teamMembers === -1 ? 'Unlimited' : plan.limits.teamMembers}
                            </span>
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px', marginBottom: '20px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#9ca3af', marginBottom: '12px' }}>
                            FEATURES
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {plan.features.slice(0, 5).map((feature, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                                <Check style={{ width: '16px', height: '16px', color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
                                <span style={{ color: '#d1d5db', fontSize: '13px', lineHeight: '1.4' }}>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (!isCurrentPlan) {
                              setSelectedPlan(plan)
                              handleConfirmUpgrade()
                            }
                          }}
                          disabled={isCurrentPlan}
                          style={{
                            width: '100%',
                            padding: '14px',
                            background: isCurrentPlan 
                              ? 'rgba(107, 114, 128, 0.5)'
                              : `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: isCurrentPlan ? 'not-allowed' : 'pointer',
                            opacity: isCurrentPlan ? 0.6 : 1,
                          }}
                        >
                          {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                        </button>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Enterprise Contact */}
                <div style={{
                  marginTop: '24px',
                  padding: '20px',
                  background: 'rgba(167, 139, 250, 0.1)',
                  border: '1px solid rgba(167, 139, 250, 0.2)',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <div style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                    Need a custom plan?
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>
                    Contact our sales team for enterprise pricing and custom solutions
                  </div>
                  <button style={{
                    padding: '10px 24px',
                    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}>
                    Contact Sales
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
