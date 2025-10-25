'use client'

import React from 'react'
import { usePermission, useAnyPermission, useAllPermissions } from '@/hooks/useRBAC'
import type { Permission } from '@/lib/rbac'

interface ProtectedProps {
  children: React.ReactNode
  permission?: Permission
  anyPermissions?: Permission[]
  allPermissions?: Permission[]
  fallback?: React.ReactNode
}

/**
 * Component that conditionally renders children based on permissions
 *
 * Usage:
 * <Protected permission="projects.create">
 *   <CreateProjectButton />
 * </Protected>
 *
 * <Protected anyPermissions={['projects.edit', 'projects.delete']}>
 *   <EditButton />
 * </Protected>
 */
export function Protected({
  children,
  permission,
  anyPermissions,
  allPermissions,
  fallback = null,
}: ProtectedProps) {
  const hasSinglePermission = usePermission(permission!)
  const hasAny = useAnyPermission(anyPermissions || [])
  const hasAll = useAllPermissions(allPermissions || [])

  let hasAccess = false

  if (permission) {
    hasAccess = hasSinglePermission
  } else if (anyPermissions && anyPermissions.length > 0) {
    hasAccess = hasAny
  } else if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAll
  } else {
    // No permissions specified, allow access
    hasAccess = true
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface RestrictedProps {
  children: React.ReactNode
  permission?: Permission
  anyPermissions?: Permission[]
  allPermissions?: Permission[]
}

/**
 * Component that renders children ONLY if user DOES NOT have the specified permissions
 * Opposite of Protected component
 *
 * Usage:
 * <Restricted permission="billing.manage">
 *   <UpgradeToPremiumBanner />
 * </Restricted>
 */
export function Restricted({
  children,
  permission,
  anyPermissions,
  allPermissions,
}: RestrictedProps) {
  const hasSinglePermission = usePermission(permission!)
  const hasAny = useAnyPermission(anyPermissions || [])
  const hasAll = useAllPermissions(allPermissions || [])

  let hasAccess = false

  if (permission) {
    hasAccess = hasSinglePermission
  } else if (anyPermissions && anyPermissions.length > 0) {
    hasAccess = hasAny
  } else if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAll
  }

  // Render children only if user DOES NOT have access
  if (hasAccess) {
    return null
  }

  return <>{children}</>
}
