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
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function BillingPage() {
  const [data, setData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'usage'>('overview')

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
                border: activeTab === tab.id ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
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
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: getPlanColor(currentPlan.name), marginBottom: '8px' }}>
                      {currentPlan.name}
                    </h3>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                      ${currentPlan.pricing.monthly}
                      <span style={{ fontSize: '16px', color: '#9ca3af', fontWeight: 'normal' }}>/month</span>
                    </div>
                    {data.nextBillingDate && (
                      <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                        Renews on {data.nextBillingDate}
                      </div>
                    )}
                  </div>
                  <button
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

            {/* Available Plans */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
                Available Plans
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {data.availablePlans.map((plan, index) => (
                  <motion.div
                    key={index}
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
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: getPlanColor(plan.name), marginBottom: '8px' }}>
                      {plan.name}
                    </h3>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
                      ${plan.pricing.monthly}
                      <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 'normal' }}>/month</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                      {plan.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                          <Check style={{ width: '16px', height: '16px', color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ color: '#d1d5db', fontSize: '13px' }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: `${getPlanColor(plan.name)}20`,
                        border: `1px solid ${getPlanColor(plan.name)}40`,
                        borderRadius: '8px',
                        color: getPlanColor(plan.name),
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Select Plan
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
                  Current Usage
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '20px',
                    }}
                  >
                    <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '12px' }}>
                      API Calls
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                      {data.usage.apiCalls.current.toLocaleString()} / {data.usage.apiCalls.limit.toLocaleString()}
                    </div>
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
                          height: '100%',
                          width: `${data.usage.apiCalls.percentage}%`,
                          background: data.usage.apiCalls.percentage > 80
                            ? 'linear-gradient(to right, #f59e0b, #d97706)'
                            : 'linear-gradient(to right, #10b981, #059669)',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                      {data.usage.apiCalls.percentage}% used
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '20px',
                    }}
                  >
                    <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '12px' }}>
                      Customers
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                      {data.usage.customers.current.toLocaleString()} / {data.usage.customers.limit.toLocaleString()}
                    </div>
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
                          height: '100%',
                          width: `${data.usage.customers.percentage}%`,
                          background: data.usage.customers.percentage > 80
                            ? 'linear-gradient(to right, #f59e0b, #d97706)'
                            : 'linear-gradient(to right, #10b981, #059669)',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                      {data.usage.customers.percentage}% used
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '20px',
                    }}
                  >
                    <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '12px' }}>
                      Storage
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                      {data.usage.storage.current} / {data.usage.storage.limit}
                    </div>
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
                          height: '100%',
                          width: `${data.usage.storage.percentage}%`,
                          background: data.usage.storage.percentage > 80
                            ? 'linear-gradient(to right, #f59e0b, #d97706)'
                            : 'linear-gradient(to right, #10b981, #059669)',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                      {data.usage.storage.percentage}% used
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '20px',
                    }}
                  >
                    <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '12px' }}>
                      Bandwidth
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                      {data.usage.bandwidth.current} / {data.usage.bandwidth.limit}
                    </div>
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
                          height: '100%',
                          width: `${data.usage.bandwidth.percentage}%`,
                          background: data.usage.bandwidth.percentage > 80
                            ? 'linear-gradient(to right, #f59e0b, #d97706)'
                            : 'linear-gradient(to right, #10b981, #059669)',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                      {data.usage.bandwidth.percentage}% used
                    </div>
                  </div>
                </div>
              </div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
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
                    <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#9ca3af' }}>
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
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
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
                        background: data.usage.apiCalls.percentage > 80
                          ? 'linear-gradient(to right, #f59e0b, #d97706)'
                          : 'linear-gradient(to right, #10b981, #059669)',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
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
                        background: data.usage.customers.percentage > 80
                          ? 'linear-gradient(to right, #f59e0b, #d97706)'
                          : 'linear-gradient(to right, #10b981, #059669)',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
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
                        background: data.usage.storage.percentage > 80
                          ? 'linear-gradient(to right, #f59e0b, #d97706)'
                          : 'linear-gradient(to right, #10b981, #059669)',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#9ca3af' }}>
                      Limit: {data.usage.storage.limit}
                    </span>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
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
                        background: data.usage.bandwidth.percentage > 80
                          ? 'linear-gradient(to right, #f59e0b, #d97706)'
                          : 'linear-gradient(to right, #10b981, #059669)',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#9ca3af' }}>
                      Limit: {data.usage.bandwidth.limit}
                    </span>
                    <span style={{ color: '#9ca3af', fontWeight: '600' }}>
                      {data.usage.bandwidth.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
