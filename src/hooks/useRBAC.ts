// RBAC Hooks for React components

import { useAuthStore } from '@/store/authStore'
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessRoute,
  getFeatureAccess,
  getRolePermissions,
  type Permission,
  type FeatureAccess,
} from '@/lib/rbac'

/**
 * Hook to check if the current user has a specific permission
 */
export function usePermission(permission: Permission): boolean {
  const { user } = useAuthStore()
  if (!user) return false
  return hasPermission(user.role, permission)
}

/**
 * Hook to check if the current user has any of the specified permissions
 */
export function useAnyPermission(permissions: Permission[]): boolean {
  const { user } = useAuthStore()
  if (!user) return false
  return hasAnyPermission(user.role, permissions)
}

/**
 * Hook to check if the current user has all of the specified permissions
 */
export function useAllPermissions(permissions: Permission[]): boolean {
  const { user } = useAuthStore()
  if (!user) return false
  return hasAllPermissions(user.role, permissions)
}

/**
 * Hook to check if the current user can access a specific route
 */
export function useCanAccessRoute(route: string): boolean {
  const { user } = useAuthStore()
  if (!user) return false
  return canAccessRoute(user.role, route)
}

/**
 * Hook to get feature access permissions for the current user
 */
export function useFeatureAccess(feature: string): FeatureAccess {
  const { user } = useAuthStore()
  if (!user) {
    return {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canExport: false,
      canManage: false,
      canViewAll: false,
    }
  }
  return getFeatureAccess(user.role, feature)
}

/**
 * Hook to get all permissions for the current user's role
 */
export function useUserPermissions(): Permission[] {
  const { user } = useAuthStore()
  if (!user) return []
  return getRolePermissions(user.role)
}

/**
 * Hook to get the current user's role
 */
export function useUserRole() {
  const { user } = useAuthStore()
  return user?.role ?? null
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  const { user } = useAuthStore()
  return user?.role === 'admin'
}

/**
 * Hook to check if user is partner
 */
export function useIsPartner(): boolean {
  const { user } = useAuthStore()
  return user?.role === 'partner'
}

/**
 * Hook to check if user is basic user
 */
export function useIsUser(): boolean {
  const { user } = useAuthStore()
  return user?.role === 'user'
}
