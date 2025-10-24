'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Activity,
  Key,
  Webhook,
  Users,
  Settings,
  FileText,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  UserCircle,
  Brain,
  Shield,
  FileBarChart,
  CreditCard,
  HelpCircle,
} from 'lucide-react'
import { useState } from 'react'

type MenuItem = {
  icon: any
  label: string
  href: string
}

type MenuSection = {
  title: string
  items: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    title: 'Core',
    items: [
      { icon: LayoutDashboard, label: 'Overview', href: '/' },
      { icon: FolderKanban, label: 'Projects & Apps', href: '/projects' },
    ],
  },
  {
    title: 'Development',
    items: [
      { icon: Key, label: 'API Keys', href: '/api-keys' },
      { icon: Activity, label: 'Logs', href: '/logs' },
      { icon: Webhook, label: 'Webhooks', href: '/webhooks' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { icon: UserCircle, label: 'Customers', href: '/customers' },
      { icon: Brain, label: 'Intelligence', href: '/intelligence' },
      { icon: Shield, label: 'Risk & Compliance', href: '/compliance' },
    ],
  },
  {
    title: 'Management',
    items: [
      { icon: FileBarChart, label: 'Reports', href: '/reports' },
      { icon: CreditCard, label: 'Billing', href: '/billing' },
      { icon: Users, label: 'Team', href: '/team' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & Support', href: '/support' },
      { icon: Settings, label: 'Settings', href: '/settings' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0, width: collapsed ? '80px' : '280px' }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '24px 16px' : '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #c084fc 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          {!collapsed && (
            <span
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #10b981, #a78bfa, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                whiteSpace: 'nowrap',
              }}
            >
              Sonaqor
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
          >
            <ChevronLeft style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
          </button>
        )}
      </div>

      {/* Collapsed expand button */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '16px auto',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
        >
          <ChevronRight style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
        </button>
      )}

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: collapsed ? '16px 8px' : '24px 16px',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title}>
              {/* Section Title */}
              {!collapsed && (
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                    paddingLeft: '16px',
                  }}
                >
                  {section.title}
                </div>
              )}

              {/* Section Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: collapsed ? '12px' : '12px 16px',
                        borderRadius: '12px',
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(192, 132, 252, 0.2) 100%)'
                          : 'transparent',
                        border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.3)' : 'transparent'}`,
                        color: isActive ? '#10b981' : '#9ca3af',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                          e.currentTarget.style.color = 'white'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#9ca3af'
                        }
                      }}
                    >
                      <Icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                      {!collapsed && (
                        <span style={{ fontWeight: isActive ? '600' : '500', fontSize: '15px' }}>
                          {item.label}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>

              {/* Section Separator */}
              {!collapsed && sectionIndex < menuSections.length - 1 && (
                <div
                  style={{
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    marginTop: '20px',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div
        style={{
          padding: collapsed ? '16px 8px' : '20px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: collapsed ? '8px' : '12px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'white',
              flexShrink: 0,
            }}
          >
            AJ
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{ fontWeight: '600', fontSize: '14px', color: 'white', marginBottom: '2px' }}
              >
                Abraham Jr
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                abraham@foresona.ai
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '10px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
            }}
          >
            <LogOut style={{ width: '18px', height: '18px' }} />
            Logout
          </button>
        )}
      </div>
    </motion.aside>
  )
}
