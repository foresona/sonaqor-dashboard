'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Edit, Trash2, Plus, Download, Settings } from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import { Protected, Restricted } from '@/components/Protected'
import {
  useUserRole,
  usePermission,
  useFeatureAccess,
  useIsAdmin,
  useIsPartner,
  useUserPermissions,
} from '@/hooks/useRBAC'

export default function RBACDemoPage() {
  const role = useUserRole()
  const isAdmin = useIsAdmin()
  const isPartner = useIsPartner()
  const projectAccess = useFeatureAccess('projects')
  const allPermissions = useUserPermissions()

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
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
            RBAC Demo
          </h1>
          <p style={{ fontSize: '16px', color: '#9ca3af' }}>
            Role-Based Access Control demonstration - Your role: <strong>{role}</strong>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px' }}>
        {/* Current Role Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: isAdmin
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : isPartner
                  ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                  : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield style={{ width: '28px', height: '28px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                You are logged in as: {role?.toUpperCase()}
              </h2>
              <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                You have {allPermissions.length} permissions
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                Can Create
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                {projectAccess.canCreate ? '✅ Yes' : '❌ No'}
              </div>
            </div>
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                Can Edit
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                {projectAccess.canEdit ? '✅ Yes' : '❌ No'}
              </div>
            </div>
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                Can Delete
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                {projectAccess.canDelete ? '✅ Yes' : '❌ No'}
              </div>
            </div>
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                Can Export
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                {projectAccess.canExport ? '✅ Yes' : '❌ No'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '16px',
            }}
          >
            Action Buttons (Based on Your Permissions)
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>
            These buttons only appear if you have the required permissions
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Protected permission="projects.create">
              <button
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <Plus style={{ width: '20px', height: '20px' }} />
                Create Project
              </button>
            </Protected>

            <Protected permission="projects.edit">
              <button
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <Edit style={{ width: '20px', height: '20px' }} />
                Edit Project
              </button>
            </Protected>

            <Protected permission="projects.delete">
              <button
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <Trash2 style={{ width: '20px', height: '20px' }} />
                Delete Project
              </button>
            </Protected>

            <Protected permission="reports.export">
              <button
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  border: 'none',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <Download style={{ width: '20px', height: '20px' }} />
                Export Data
              </button>
            </Protected>

            <Protected permission="settings.security">
              <button
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  border: 'none',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <Settings style={{ width: '20px', height: '20px' }} />
                Security Settings
              </button>
            </Protected>
          </div>
        </motion.div>

        {/* Restricted Content Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '16px',
            }}
          >
            Conditional Messages
          </h3>

          <Restricted permission="billing.manage">
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Lock style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#fca5a5' }}>Limited Access</div>
                  <div style={{ fontSize: '14px', color: '#fca5a5' }}>
                    You don't have permission to manage billing. Contact your administrator.
                  </div>
                </div>
              </div>
            </div>
          </Restricted>

          <Protected permission="billing.manage">
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Shield style={{ width: '20px', height: '20px', color: '#10b981' }} />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#6ee7b7' }}>Full Access</div>
                  <div style={{ fontSize: '14px', color: '#6ee7b7' }}>
                    You have permission to manage billing settings.
                  </div>
                </div>
              </div>
            </div>
          </Protected>

          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <div style={{ fontWeight: 'bold', color: '#93c5fd', marginBottom: '8px' }}>
              Your Permissions ({allPermissions.length} total)
            </div>
            <div
              style={{
                maxHeight: '200px',
                overflowY: 'auto',
                fontSize: '13px',
                color: '#cbd5e1',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '8px',
              }}
            >
              {allPermissions.map((permission) => (
                <div key={permission} style={{ padding: '4px' }}>
                  ✓ {permission}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
