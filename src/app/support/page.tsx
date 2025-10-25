'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { getSupportData, type SupportData } from '@/data/support'
import {
  HelpCircle,
  Search,
  MessageCircle,
  BookOpen,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ExternalLink,
  User,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SupportPage() {
  const [data, setData] = useState<SupportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'tickets' | 'knowledge'>('tickets')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [showNewTicket, setShowNewTicket] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const supportData = await getSupportData()
    setData(supportData)
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return '#3b82f6'
      case 'In Progress':
        return '#f59e0b'
      case 'Resolved':
        return '#10b981'
      case 'Closed':
        return '#6b7280'
      default:
        return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return AlertCircle
      case 'In Progress':
        return Clock
      case 'Resolved':
      case 'Closed':
        return CheckCircle
      default:
        return MessageCircle
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getCategoryColor = (category: string) => {
    const colors: any = {
      'Getting Started': '#3b82f6',
      API: '#10b981',
      Integration: '#a78bfa',
      Billing: '#f59e0b',
      Security: '#ef4444',
      'Best Practices': '#06b6d4',
    }
    return colors[category] || '#6b7280'
  }

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          Loading support center...
        </div>
      </DashboardLayout>
    )
  }

  const categories = [
    'All',
    ...Array.from(new Set(data.articles.map((article) => article.category))),
  ]

  const filteredArticles = data.articles.filter((article) => {
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
    return matchesSearch && matchesCategory
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
              <HelpCircle style={{ width: '32px', height: '32px', color: '#10b981' }} />
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
                Help & Support
              </h1>
            </div>

            <button
              onClick={() => setShowNewTicket(true)}
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
              New Ticket
            </button>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Get help, browse documentation, and submit support tickets
          </p>
        </div>

        {/* Search Bar */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Search style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'white',
              fontSize: '14px',
            }}
          />
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
            { id: 'tickets', label: 'My Tickets', icon: MessageCircle },
            { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
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

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.tickets.map((ticket) => {
              const StatusIcon = getStatusIcon(ticket.status)
              return (
                <div
                  key={ticket.id}
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
                      marginBottom: '12px',
                    }}
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
                          {ticket.subject}
                        </h3>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: `${getStatusColor(ticket.status)}20`,
                            color: getStatusColor(ticket.status),
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <StatusIcon style={{ width: '12px', height: '12px' }} />
                          {ticket.status}
                        </span>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: `${getPriorityColor(ticket.priority)}20`,
                            color: getPriorityColor(ticket.priority),
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '24px',
                          fontSize: '13px',
                          color: '#9ca3af',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <span style={{ color: '#6b7280' }}>Ticket: </span>#{ticket.id}
                        </div>
                        <div>
                          <span style={{ color: '#6b7280' }}>Created: </span>
                          {ticket.createdAt}
                        </div>
                      </div>
                      <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.5' }}>
                        {ticket.messages[0]?.message || 'No description available'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                          color: '#3b82f6',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {ticket.messages.length}{' '}
                        {ticket.messages.length === 1 ? 'Message' : 'Messages'}
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
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Knowledge Base Tab */}
        {activeTab === 'knowledge' && (
          <div>
            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '8px 16px',
                    background:
                      selectedCategory === category
                        ? `${category === 'All' ? '#10b981' : getCategoryColor(category)}20`
                        : 'rgba(255, 255, 255, 0.05)',
                    border:
                      selectedCategory === category
                        ? `1px solid ${
                            category === 'All' ? '#10b981' : getCategoryColor(category)
                          }40`
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color:
                      selectedCategory === category
                        ? category === 'All'
                          ? '#10b981'
                          : getCategoryColor(category)
                        : '#9ca3af',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)'
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${getCategoryColor(article.category)}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FileText
                        style={{
                          width: '20px',
                          height: '20px',
                          color: getCategoryColor(article.category),
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '6px',
                        }}
                      >
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: `${getCategoryColor(article.category)}20`,
                            color: getCategoryColor(article.category),
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {article.category}
                        </span>
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>
                          {article.views} views
                        </span>
                      </div>
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '8px',
                        }}
                      >
                        {article.title}
                      </h3>
                    </div>
                  </div>
                  <p
                    style={{
                      color: '#9ca3af',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                    }}
                  >
                    {article.content.substring(0, 150)}...
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>
                      Updated {article.lastUpdated}
                    </div>
                    <div
                      style={{
                        color: '#10b981',
                        fontSize: '13px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      Read More
                      <ExternalLink style={{ width: '14px', height: '14px' }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div
                style={{
                  padding: '60px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Search
                  style={{ width: '48px', height: '48px', color: '#6b7280', margin: '0 auto 16px' }}
                />
                <p style={{ color: '#9ca3af', fontSize: '16px' }}>
                  No articles found matching your search.
                </p>
              </div>
            )}
          </div>
        )}

        {/* New Ticket Modal */}
        <AnimatePresence>
          {showNewTicket && (
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
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
              }}
              onClick={() => setShowNewTicket(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'rgba(17, 24, 39, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '32px',
                  maxWidth: '600px',
                  width: '100%',
                }}
              >
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '24px',
                  }}
                >
                  Submit New Support Ticket
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: '#9ca3af',
                        fontSize: '13px',
                        marginBottom: '8px',
                      }}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Brief description of your issue"
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
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: '#9ca3af',
                        fontSize: '13px',
                        marginBottom: '8px',
                      }}
                    >
                      Category
                    </label>
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
                      }}
                    >
                      <option>Technical Issue</option>
                      <option>Billing Question</option>
                      <option>Feature Request</option>
                      <option>Integration Help</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: '#9ca3af',
                        fontSize: '13px',
                        marginBottom: '8px',
                      }}
                    >
                      Priority
                    </label>
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
                      }}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: '#9ca3af',
                        fontSize: '13px',
                        marginBottom: '8px',
                      }}
                    >
                      Description
                    </label>
                    <textarea
                      placeholder="Provide detailed information about your issue..."
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                        minHeight: '120px',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button
                      onClick={() => setShowNewTicket(false)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#9ca3af',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'linear-gradient(135deg, #10b981 0%, #a78bfa 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Submit Ticket
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
