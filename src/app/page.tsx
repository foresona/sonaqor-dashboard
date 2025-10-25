'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  AlertCircle,
  Activity,
  Zap,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  Globe,
  Code,
  ArrowRight,
  Calendar,
  Filter,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import { getDashboardData, type DashboardData } from '@/data/dashboard'

const iconMap: { [key: string]: typeof Users } = {
  Users,
  TrendingUp,
  Activity,
  AlertCircle,
  Zap,
}

export default function DashboardHome() {
  const [timeRange, setTimeRange] = useState('7d')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await getDashboardData(timeRange)
      setData(result)
      setLoading(false)
    }
    fetchData()
  }, [timeRange])

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
          }}
        >
          <div style={{ fontSize: '18px', color: '#9ca3af' }}>Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ padding: '32px 40px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Welcome back, Abraham 👋
                </h1>
                <p style={{ fontSize: '16px', color: '#9ca3af' }}>
                  Here's what's happening with your API
                </p>
              </div>

              {/* Time Range Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '4px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {[
                    { label: '24h', value: '24h' },
                    { label: '7d', value: '7d' },
                    { label: '30d', value: '30d' },
                    { label: '90d', value: '90d' },
                  ].map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setTimeRange(range.value)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background:
                          timeRange === range.value
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)'
                            : 'transparent',
                        border:
                          timeRange === range.value
                            ? '1px solid rgba(16, 185, 129, 0.4)'
                            : '1px solid transparent',
                        color: timeRange === range.value ? '#10b981' : '#9ca3af',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (timeRange !== range.value) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (timeRange !== range.value) {
                          e.currentTarget.style.background = 'transparent'
                        }
                      }}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px' }}>
        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {data.stats.map((stat, idx) => {
            const IconComponent = iconMap[stat.icon] || Activity
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '24px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column' as const,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${stat.gradientStart} 0%, ${stat.gradientEnd} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  transition: 'transform 0.3s ease',
                }}
              >
                <IconComponent style={{ width: '28px', height: '28px', color: 'white' }} />
              </div>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: 'white',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '12px' }}>
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: stat.change.startsWith('+') ? '#34d399' : '#f87171',
                  marginTop: 'auto',
                }}
              >
                {stat.change} from last week
              </div>
            </motion.div>
            )
          })}
        </div>

        {/* Two Column Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* API Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '4px',
                  }}
                >
                  API Performance
                </h2>
                <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                  {timeRange === '24h' && 'Last 24 hours'}
                  {timeRange === '7d' && 'Last 7 days'}
                  {timeRange === '30d' && 'Last 30 days'}
                  {timeRange === '90d' && 'Last 90 days'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                    Requests
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>312K</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                    Avg Time
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>1.2s</div>
                </div>
              </div>
            </div>

            {/* Trading-Style Line Chart */}
            <div
              style={{
                position: 'relative',
                height: '280px',
                padding: '20px 0',
              }}
            >
              {/* Grid Lines */}
              <div
                style={{
                  position: 'absolute',
                  inset: '20px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '100%',
                      height: '1px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        right: '100%',
                        top: '-8px',
                        paddingRight: '12px',
                        fontSize: '11px',
                        color: '#6b7280',
                        fontFamily: 'monospace',
                      }}
                    >
                      {100 - i * 25}K
                    </span>
                  </div>
                ))}
              </div>

              {/* Line Chart with Area Fill */}
              <svg
                width="100%"
                height="100%"
                style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Area Fill */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.6 }}
                  d="M 50 140 L 150 100 L 250 160 L 350 60 L 450 95 L 550 45 L 650 80 L 650 260 L 50 260 Z"
                  fill="url(#chartGradient)"
                  strokeWidth="0"
                />

                {/* Line */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.6 }}
                  d="M 50 140 L 150 100 L 250 160 L 350 60 L 450 95 L 550 45 L 650 80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />

                {/* Data Points */}
                {[
                  { x: 50, y: 140, value: '42K' },
                  { x: 150, y: 100, value: '51K' },
                  { x: 250, y: 160, value: '35K' },
                  { x: 350, y: 60, value: '58K' },
                  { x: 450, y: 95, value: '48K' },
                  { x: 550, y: 45, value: '63K' },
                  { x: 650, y: 80, value: '54K' },
                ].map((point, i) => (
                  <motion.g
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                  >
                    {/* Outer glow circle */}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="8"
                      fill="#10b981"
                      opacity="0.2"
                      className={`pulse-${i}`}
                    />
                    {/* Inner circle */}
                    <circle cx={point.x} cy={point.y} r="5" fill="#10b981" />
                    <circle cx={point.x} cy={point.y} r="3" fill="white" />

                    {/* Hover area for tooltip */}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="15"
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        const tooltip = document.getElementById(`tooltip-${i}`)
                        if (tooltip) tooltip.style.opacity = '1'
                      }}
                      onMouseLeave={(e) => {
                        const tooltip = document.getElementById(`tooltip-${i}`)
                        if (tooltip) tooltip.style.opacity = '0'
                      }}
                    />
                  </motion.g>
                ))}
              </svg>

              {/* Tooltips */}
              {[
                { x: 50, y: 140, value: '42K', day: 'Mon' },
                { x: 150, y: 100, value: '51K', day: 'Tue' },
                { x: 250, y: 160, value: '35K', day: 'Wed' },
                { x: 350, y: 60, value: '58K', day: 'Thu' },
                { x: 450, y: 95, value: '48K', day: 'Fri' },
                { x: 550, y: 45, value: '63K', day: 'Sat' },
                { x: 650, y: 80, value: '54K', day: 'Sun' },
              ].map((point, i) => (
                <div
                  key={i}
                  id={`tooltip-${i}`}
                  style={{
                    position: 'absolute',
                    left: `${point.x}px`,
                    top: `${point.y - 50}px`,
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    pointerEvents: 'none',
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>
                    {point.day}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981' }}>
                    {point.value}
                  </div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                    requests
                  </div>
                </div>
              ))}

              {/* X-axis labels */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                }}
              >
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      fontWeight: '500',
                      fontFamily: 'monospace',
                      textAlign: 'center',
                      flex: 1,
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <style jsx>{`
              @keyframes pulse {
                0%,
                100% {
                  opacity: 0.2;
                  r: 8;
                }
                50% {
                  opacity: 0.4;
                  r: 12;
                }
              }
              ${[0, 1, 2, 3, 4, 5, 6]
                .map(
                  (i) => `
                .pulse-${i} {
                  animation: pulse 2s ease-in-out infinite;
                  animation-delay: ${i * 0.2}s;
                }
              `,
                )
                .join('')}
            `}</style>
          </motion.div>

          {/* Top Endpoints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
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
              style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}
            >
              Top Endpoints
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { endpoint: '/forecast/generate', calls: '45.2K', percentage: 85 },
                { endpoint: '/persona/match', calls: '32.1K', percentage: 60 },
                { endpoint: '/fscores/calculate', calls: '21.5K', percentage: 40 },
                { endpoint: '/anomaly/detect', calls: '12.3K', percentage: 25 },
              ].map((item, i) => (
                <div key={i}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '13px', color: 'white', fontFamily: 'monospace' }}>
                      {item.endpoint}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981' }}>
                      {item.calls}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                        borderRadius: '3px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Success Rate & Response Times */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{
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
            <h3
              style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}
            >
              Success Rate
            </h3>
            <div
              style={{
                position: 'relative',
                width: '180px',
                height: '180px',
                margin: '0 auto 32px',
              }}
            >
              <svg viewBox="0 0 180 180" style={{ overflow: 'visible' }}>
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="failGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                {/* Background track */}
                <circle
                  cx="90"
                  cy="90"
                  r="75"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="16"
                  transform="rotate(-90 90 90)"
                />

                {/* Failed portion (red) - drawn first */}
                <motion.circle
                  cx="90"
                  cy="90"
                  r="75"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="16"
                  strokeDasharray="471.24"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -(471.24 * 0.8) / 100 }}
                  transition={{ duration: 1.8, ease: 'easeOut', delay: 0.8 }}
                  strokeLinecap="round"
                  transform="rotate(-90 90 90)"
                />

                {/* Success portion (green) - overlays on top */}
                <motion.circle
                  cx="90"
                  cy="90"
                  r="75"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeDasharray="471.24"
                  initial={{ strokeDashoffset: 471.24 }}
                  animate={{ strokeDashoffset: 471.24 - (471.24 * 99.2) / 100 }}
                  transition={{ duration: 2, ease: 'easeOut', delay: 0.8 }}
                  strokeLinecap="round"
                  transform="rotate(-90 90 90)"
                />
              </svg>

              {/* Center text */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  style={{
                    fontSize: '42px',
                    fontWeight: 'bold',
                    color: 'white',
                    lineHeight: 1,
                    marginBottom: '4px',
                  }}
                >
                  99.2%
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    fontWeight: '500',
                  }}
                >
                  Success Rate
                </motion.div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                  Success
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                  312,456
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                  Failed
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>2,544</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            style={{
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
            <h3
              style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}
            >
              Response Times
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: 'p50', value: '245ms', color: '#10b981' },
                { label: 'p90', value: '892ms', color: '#3b82f6' },
                { label: 'p99', value: '1.8s', color: '#a855f7' },
              ].map((item, i) => (
                <div key={i}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500' }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: '24px',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '500' }}>
                ✓ 12% faster than last week
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
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
            <h3
              style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}
            >
              Geographic Distribution
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { country: 'Nigeria', requests: '156K', flag: '🇳🇬', percentage: 75 },
                { country: 'Kenya', requests: '89K', flag: '🇰🇪', percentage: 43 },
                { country: 'South Africa', requests: '52K', flag: '🇿🇦', percentage: 25 },
                { country: 'Ghana', requests: '18K', flag: '🇬🇭', percentage: 8 },
              ].map((item, i) => (
                <div key={i}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: 'white' }}>
                      {item.flag} {item.country}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6' }}>
                      {item.requests}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            marginBottom: '32px',
          }}
        >
          <h2
            style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px', color: 'white' }}
          >
            Quick Actions
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                href: '/upload',
                title: 'Upload Statement',
                desc: 'Add new user data',
                icon: Zap,
                gradientStart: '#3b82f6',
                gradientEnd: '#06b6d4',
              },
              {
                href: '/insights',
                title: 'View Insights',
                desc: 'Explore behavioral patterns',
                icon: BarChart3,
                gradientStart: '#a855f7',
                gradientEnd: '#ec4899',
              },
              {
                href: '/api-keys',
                title: 'Manage API Keys',
                desc: 'Configure integrations',
                icon: Sparkles,
                gradientStart: '#10b981',
                gradientEnd: '#059669',
              },
            ].map((action, i) => (
              <Link
                key={action.title}
                href={action.href}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'block',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${action.gradientStart} 0%, ${action.gradientEnd} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <action.icon style={{ width: '28px', height: '28px', color: 'white' }} />
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'white',
                  }}
                >
                  {action.title}
                </div>
                <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>{action.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{
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
            style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: 'white' }}
          >
            Recent Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                action: 'Persona forecast generated',
                user: 'user_1234',
                time: '2 minutes ago',
                status: 'success',
              },
              {
                action: 'Anomaly detected',
                user: 'user_5678',
                time: '15 minutes ago',
                status: 'warning',
              },
              {
                action: 'F_scores calculated',
                user: 'user_9012',
                time: '1 hour ago',
                status: 'success',
              },
              {
                action: 'New API key created',
                user: 'Your account',
                time: '3 hours ago',
                status: 'info',
              },
            ].map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + i * 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor:
                        activity.status === 'success'
                          ? '#34d399'
                          : activity.status === 'warning'
                          ? '#fbbf24'
                          : '#60a5fa',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: '500', color: 'white', marginBottom: '4px' }}>
                      {activity.action}
                    </div>
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>{activity.user}</div>
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af', flexShrink: 0 }}>
                  {activity.time}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
