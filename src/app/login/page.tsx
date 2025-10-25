'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [pageLoading, setPageLoading] = useState(true)

  // Page loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')
    clearError()

    // Basic validation
    if (!email || !password) {
      setValidationError('Please enter both email and password')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Please enter a valid email address')
      return
    }

    try {
      await login(email, password)
      router.push('/')
    } catch (err) {
      // Error is handled by the store
    }
  }

  const displayError = validationError || error

  // Show loading screen
  if (pageLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 25%, #f97316 50%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ textAlign: 'center' }}
        >
          <Loader2
            style={{
              width: '48px',
              height: '48px',
              color: 'white',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>
            {`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 25%, #f97316 50%, #06b6d4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Sonaqor Logo */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          left: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles style={{ width: '20px', height: '20px', color: '#10b981' }} />
        </div>
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>sonaqor</span>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'white',
          borderRadius: '12px',
          padding: '48px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '32px',
          }}
        >
          Sign in to your account
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {displayError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <AlertCircle style={{ width: '18px', height: '18px', color: '#ef4444', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: '#dc2626' }}>{displayError}</span>
            </motion.div>
          )}

          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                borderRadius: '6px',
                background: 'white',
                border: '1px solid #d1d5db',
                color: '#1f2937',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981'
                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label
                htmlFor="password"
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Password
              </label>
              <a
                href="#"
                style={{
                  fontSize: '13px',
                  color: '#10b981',
                  textDecoration: 'none',
                }}
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 44px 0 14px',
                  borderRadius: '6px',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  color: '#1f2937',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981'
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#6b7280',
                }}
              >
                {showPassword ? (
                  <EyeOff style={{ width: '20px', height: '20px' }} />
                ) : (
                  <Eye style={{ width: '20px', height: '20px' }} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '44px',
              borderRadius: '6px',
              background: isLoading ? '#9ca3af' : '#10b981',
              border: 'none',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '24px',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#059669'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#10b981'
              }
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Divider */}
          <div style={{ position: 'relative', textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#e5e7eb' }} />
            <span
              style={{
                position: 'relative',
                background: 'white',
                padding: '0 16px',
                fontSize: '13px',
                color: '#9ca3af',
              }}
            >
              OR
            </span>
          </div>

          {/* Demo Credentials */}
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Demo Credentials
            </div>
            <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.8' }}>
              <div><strong>Admin:</strong> admin@sonaqor.com / admin123</div>
              <div><strong>Partner:</strong> partner@example.com / partner123</div>
              <div><strong>User:</strong> user@example.com / user123</div>
            </div>
          </div>
        </form>

        {/* Footer Link */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            New to Sonaqor?{' '}
            <a
              href="#"
              style={{ color: '#10b981', textDecoration: 'none', fontWeight: '500' }}
              onClick={(e) => e.preventDefault()}
            >
              Create account
            </a>
          </span>
        </div>
      </motion.div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '24px',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <span>© Sonaqor</span>
        <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Privacy & terms</a>
      </div>
    </div>
  )
}
