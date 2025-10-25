'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Building,
  CreditCard,
  Bell,
  Shield,
  Webhook,
  Save,
  Globe,
  Database,
  Zap,
  Lock,
  CheckCircle,
  X,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  // Profile states
  const [fullName, setFullName] = useState('Abraham Jr Agiri')
  const [email, setEmail] = useState('abraham@foresona.ai')
  const [company, setCompany] = useState('Foresona')

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [rateLimitAlerts, setRateLimitAlerts] = useState(true)
  const [errorNotifications, setErrorNotifications] = useState(true)
  const [usageReports, setUsageReports] = useState(false)
  const [securityAlerts, setSecurityAlerts] = useState(true)

  // API Settings states
  const [rateLimit, setRateLimit] = useState('1000')
  const [timezone, setTimezone] = useState('UTC')
  const [dataRetention, setDataRetention] = useState('90')

  // Security
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleEnable2FA = () => {
    setTwoFactorEnabled(true)
    setShow2FAModal(false)
    alert('Two-Factor Authentication enabled successfully!')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API Settings', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield },
  ]

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
              Settings
            </h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '16px',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                borderRadius: '10px 10px 0 0',
                background:
                  activeTab === tab.id
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)'
                    : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #10b981' : '2px solid transparent',
                color: activeTab === tab.id ? '#10b981' : '#9ca3af',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <tab.icon style={{ width: '18px', height: '18px' }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ maxWidth: '900px' }}>
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '32px',
                marginBottom: '24px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <User style={{ width: '24px', height: '24px' }} />
                Profile Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '32px',
                marginBottom: '24px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Bell style={{ width: '24px', height: '24px' }} />
                Notification Preferences
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  {
                    label: 'Email Notifications',
                    desc: 'Receive email notifications for important events',
                    checked: emailNotifications,
                    onChange: setEmailNotifications,
                  },
                  {
                    label: 'API Rate Limit Alerts',
                    desc: 'Get notified when approaching rate limits',
                    checked: rateLimitAlerts,
                    onChange: setRateLimitAlerts,
                  },
                  {
                    label: 'Error Notifications',
                    desc: 'Receive alerts for API errors and failures',
                    checked: errorNotifications,
                    onChange: setErrorNotifications,
                  },
                  {
                    label: 'Weekly Usage Reports',
                    desc: 'Weekly summary of your API usage',
                    checked: usageReports,
                    onChange: setUsageReports,
                  },
                  {
                    label: 'Security Alerts',
                    desc: 'Important security and account updates',
                    checked: securityAlerts,
                    onChange: setSecurityAlerts,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: '500',
                          color: 'white',
                          marginBottom: '4px',
                        }}
                      >
                        {item.label}
                      </div>
                      <div style={{ fontSize: '13px', color: '#9ca3af' }}>{item.desc}</div>
                    </div>
                    <label
                      style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '48px',
                        height: '28px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => item.onChange(e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: item.checked
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '14px',
                          transition: '0.3s',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            content: '""',
                            height: '20px',
                            width: '20px',
                            left: item.checked ? '24px' : '4px',
                            bottom: '4px',
                            background: 'white',
                            borderRadius: '50%',
                            transition: '0.3s',
                          }}
                        />
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '32px',
                marginBottom: '24px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Zap style={{ width: '24px', height: '24px' }} />
                API & Data Settings
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    API Rate Limit (requests/minute)
                  </label>
                  <input
                    type="number"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                    }}
                  />
                  <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
                    Maximum number of API requests allowed per minute
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Africa/Lagos">Lagos (WAT)</option>
                  </select>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
                    Used for timestamps in reports and logs
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#9ca3af',
                      marginBottom: '8px',
                    }}
                  >
                    Data Retention Period (days)
                  </label>
                  <select
                    value={dataRetention}
                    onChange={(e) => setDataRetention(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">1 year</option>
                  </select>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
                    How long to keep API logs and analytics data
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '32px',
                marginBottom: '24px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Shield style={{ width: '24px', height: '24px' }} />
                Security Settings
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button
                  onClick={() => alert('Change password modal would open here')}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '15px',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')
                  }
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Change Password</div>
                    <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                      Update your account password
                    </div>
                  </div>
                  <Lock style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                </button>

                <button
                  onClick={() => setShow2FAModal(true)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: twoFactorEnabled
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: twoFactorEnabled
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '15px',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = twoFactorEnabled
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(255, 255, 255, 0.1)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = twoFactorEnabled
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(255, 255, 255, 0.05)')
                  }
                >
                  <div>
                    <div
                      style={{
                        fontWeight: '600',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      Two-Factor Authentication
                      {twoFactorEnabled && (
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#10b981',
                          }}
                        >
                          ENABLED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                      {twoFactorEnabled
                        ? 'Manage 2FA settings'
                        : 'Add an extra layer of security to your account'}
                    </div>
                  </div>
                  {twoFactorEnabled ? (
                    <CheckCircle style={{ width: '20px', height: '20px', color: '#10b981' }} />
                  ) : (
                    <Shield style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                  )}
                </button>

                <div
                  style={{
                    marginTop: '24px',
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#ef4444',
                      marginBottom: '8px',
                    }}
                  >
                    Danger Zone
                  </h3>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          'Are you sure you want to delete your account? This action cannot be undone.',
                        )
                      ) {
                        alert('Account deletion would be processed here')
                      }
                    }}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '10px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      width: '100%',
                      marginTop: '12px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')
                    }
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}
          >
            <button
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#9ca3af',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '15px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.color = '#9ca3af'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '12px 32px',
                borderRadius: '12px',
                background: saved
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Save style={{ width: '18px', height: '18px' }} />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </motion.div>
        </div>
      </div>

      {/* 2FA Modal */}
      <AnimatePresence>
        {show2FAModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow2FAModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background:
                  'linear-gradient(135deg, rgba(30, 30, 35, 0.98) 0%, rgba(20, 20, 25, 0.98) 100%)',
                borderRadius: '20px',
                padding: '32px',
                maxWidth: '500px',
                width: '100%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
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
                  Enable Two-Factor Authentication
                </h2>
                <button
                  onClick={() => setShow2FAModal(false)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                  }}
                >
                  <X style={{ width: '20px', height: '20px' }} />
                </button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#9ca3af',
                    marginBottom: '16px',
                    lineHeight: '1.6',
                  }}
                >
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  or manually enter the secret key.
                </p>

                <div
                  style={{
                    padding: '24px',
                    borderRadius: '12px',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  {/* Placeholder for QR code */}
                  <div
                    style={{
                      width: '200px',
                      height: '200px',
                      background: '#f3f4f6',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b7280',
                    }}
                  >
                    QR Code
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontFamily: 'monospace',
                    color: '#10b981',
                    textAlign: 'center',
                    fontSize: '14px',
                  }}
                >
                  JBSWY3DPEHPK3PXP
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => setShow2FAModal(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEnable2FA}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                  }}
                >
                  Enable 2FA
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
