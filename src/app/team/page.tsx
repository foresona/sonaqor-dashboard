'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Plus,
  Mail,
  Shield,
  Crown,
  UserCheck,
  Clock,
  MoreVertical,
  Trash2,
  Edit2,
  UserMinus,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'developer' | 'viewer'
  avatar: string
  status: 'active' | 'invited' | 'inactive'
  joined: string
  lastActive: string
  apiCalls: number
}

export default function TeamPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'invited'>('all')

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Abraham Jr Agiri',
      email: 'abraham@foresona.ai',
      role: 'owner',
      avatar: 'AJ',
      status: 'active',
      joined: '2025-06-15',
      lastActive: '2 minutes ago',
      apiCalls: 145632,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@foresona.ai',
      role: 'admin',
      avatar: 'SJ',
      status: 'active',
      joined: '2025-07-20',
      lastActive: '1 hour ago',
      apiCalls: 89234,
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.c@foresona.ai',
      role: 'developer',
      avatar: 'MC',
      status: 'active',
      joined: '2025-08-10',
      lastActive: '3 hours ago',
      apiCalls: 56421,
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      email: 'emily.r@foresona.ai',
      role: 'developer',
      avatar: 'ER',
      status: 'invited',
      joined: '2025-10-22',
      lastActive: 'Never',
      apiCalls: 0,
    },
    {
      id: '5',
      name: 'David Kim',
      email: 'david.k@foresona.ai',
      role: 'viewer',
      avatar: 'DK',
      status: 'active',
      joined: '2025-09-05',
      lastActive: '2 days ago',
      apiCalls: 12453,
    },
  ]

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return Crown
      case 'admin':
        return Shield
      case 'developer':
        return UserCheck
      default:
        return Users
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return { bg: 'rgba(251, 191, 36, 0.2)', border: 'rgba(251, 191, 36, 0.3)', text: '#fbbf24' }
      case 'admin':
        return { bg: 'rgba(139, 92, 246, 0.2)', border: 'rgba(139, 92, 246, 0.3)', text: '#8b5cf6' }
      case 'developer':
        return { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.3)', text: '#3b82f6' }
      default:
        return {
          bg: 'rgba(156, 163, 175, 0.2)',
          border: 'rgba(156, 163, 175, 0.3)',
          text: '#9ca3af',
        }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'rgba(16, 185, 129, 0.2)', border: 'rgba(16, 185, 129, 0.3)', text: '#10b981' }
      case 'invited':
        return { bg: 'rgba(251, 191, 36, 0.2)', border: 'rgba(251, 191, 36, 0.3)', text: '#fbbf24' }
      case 'inactive':
        return {
          bg: 'rgba(156, 163, 175, 0.2)',
          border: 'rgba(156, 163, 175, 0.3)',
          text: '#9ca3af',
        }
      default:
        return {
          bg: 'rgba(156, 163, 175, 0.2)',
          border: 'rgba(156, 163, 175, 0.3)',
          text: '#9ca3af',
        }
    }
  }

  const filteredMembers = teamMembers.filter((member) => {
    if (activeFilter === 'all') return true
    return member.status === activeFilter
  })

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
              <Users style={{ width: '32px', height: '32px', color: '#10b981' }} />
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
                Team Management
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
              Invite Member
            </button>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Manage your team members and their permissions • {teamMembers.length} team members
          </p>
        </div>

        {/* Content */}
        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {[
            {
              label: 'Total Members',
              value: '5',
              icon: Users,
              gradient: { start: '#3b82f6', end: '#8b5cf6' },
            },
            {
              label: 'Active',
              value: '4',
              icon: UserCheck,
              gradient: { start: '#10b981', end: '#059669' },
            },
            {
              label: 'Pending Invites',
              value: '1',
              icon: Mail,
              gradient: { start: '#f59e0b', end: '#ef4444' },
            },
            {
              label: 'Total API Calls',
              value: '304K',
              icon: Clock,
              gradient: { start: '#a855f7', end: '#ec4899' },
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${stat.gradient.start} 0%, ${stat.gradient.end} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <stat.icon style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '4px',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {[
            { key: 'all', label: 'All Members' },
            { key: 'active', label: 'Active' },
            { key: 'invited', label: 'Invited' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as any)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                background:
                  activeFilter === filter.key
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                border:
                  activeFilter === filter.key
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Team Members List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredMembers.map((member, index) => {
              const roleColor = getRoleColor(member.role)
              const statusColor = getStatusColor(member.status)
              const RoleIcon = getRoleIcon(member.role)

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '24px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* Avatar */}
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #c084fc 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: 'white',
                        flexShrink: 0,
                      }}
                    >
                      {member.avatar}
                    </div>

                    {/* Member Info */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '8px',
                        }}
                      >
                        <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white' }}>
                          {member.name}
                        </h3>
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            background: roleColor.bg,
                            border: `1px solid ${roleColor.border}`,
                            color: roleColor.text,
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <RoleIcon style={{ width: '12px', height: '12px' }} />
                          {member.role}
                        </span>
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            background: statusColor.bg,
                            border: `1px solid ${statusColor.border}`,
                            color: statusColor.text,
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {member.status}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '16px',
                        }}
                      >
                        <Mail style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                        <span style={{ fontSize: '14px', color: '#9ca3af' }}>{member.email}</span>
                      </div>

                      {/* Stats */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '16px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                            Joined
                          </div>
                          <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>
                            {member.joined}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                            Last Active
                          </div>
                          <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>
                            {member.lastActive}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                            API Calls
                          </div>
                          <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>
                            {member.apiCalls.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {member.role !== 'owner' && (
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button
                          style={{
                            padding: '10px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#9ca3af',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
                            e.currentTarget.style.color = '#3b82f6'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                            e.currentTarget.style.color = '#9ca3af'
                          }}
                        >
                          <Edit2 style={{ width: '18px', height: '18px' }} />
                        </button>
                        {member.status === 'invited' ? (
                          <button
                            style={{
                              padding: '10px',
                              borderRadius: '10px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#ef4444',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                            }}
                          >
                            <UserMinus style={{ width: '18px', height: '18px' }} />
                          </button>
                        ) : (
                          <button
                            style={{
                              padding: '10px',
                              borderRadius: '10px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#ef4444',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                            }}
                          >
                            <Trash2 style={{ width: '18px', height: '18px' }} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Role Permissions Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: '32px',
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
        >
          <h2
            style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}
          >
            Role Permissions
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              {
                role: 'owner',
                icon: Crown,
                color: '#fbbf24',
                permissions: [
                  'Full access',
                  'Billing management',
                  'Delete workspace',
                  'Manage all members',
                ],
              },
              {
                role: 'admin',
                icon: Shield,
                color: '#8b5cf6',
                permissions: [
                  'Manage members',
                  'API keys access',
                  'View all logs',
                  'Configure webhooks',
                ],
              },
              {
                role: 'developer',
                icon: UserCheck,
                color: '#3b82f6',
                permissions: [
                  'Create API keys',
                  'View own logs',
                  'Access documentation',
                  'Limited webhooks',
                ],
              },
              {
                role: 'viewer',
                icon: Users,
                color: '#9ca3af',
                permissions: ['View dashboard', 'View documentation', 'No API access', 'Read-only'],
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: `${item.color}33`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <item.icon style={{ width: '18px', height: '18px', color: item.color }} />
                  </div>
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'white',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.role}
                  </span>
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {item.permissions.map((perm, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: '13px',
                        color: '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: item.color,
                        }}
                      />
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
