// Role-Based Access Control (RBAC) System

export type Role = 'admin' | 'partner' | 'user'

export type Permission =
  // Dashboard
  | 'dashboard.view'
  | 'dashboard.analytics'

  // Projects
  | 'projects.view'
  | 'projects.create'
  | 'projects.edit'
  | 'projects.delete'

  // API Keys
  | 'apikeys.view'
  | 'apikeys.create'
  | 'apikeys.revoke'
  | 'apikeys.manage'

  // Logs
  | 'logs.view'
  | 'logs.export'
  | 'logs.delete'

  // Webhooks
  | 'webhooks.view'
  | 'webhooks.create'
  | 'webhooks.edit'
  | 'webhooks.delete'

  // Customers
  | 'customers.view'
  | 'customers.viewAll'
  | 'customers.edit'
  | 'customers.delete'
  | 'customers.export'

  // Intelligence
  | 'intelligence.view'
  | 'intelligence.viewAll'
  | 'intelligence.export'

  // Compliance
  | 'compliance.view'
  | 'compliance.manage'
  | 'compliance.export'

  // Reports
  | 'reports.view'
  | 'reports.create'
  | 'reports.export'
  | 'reports.schedule'

  // Billing
  | 'billing.view'
  | 'billing.manage'
  | 'billing.viewInvoices'
  | 'billing.downloadInvoices'

  // Team
  | 'team.view'
  | 'team.invite'
  | 'team.edit'
  | 'team.remove'
  | 'team.manageRoles'

  // Support
  | 'support.view'
  | 'support.createTicket'

  // Settings
  | 'settings.view'
  | 'settings.edit'
  | 'settings.security'
  | 'settings.integrations'
  | 'settings.billing'

// Role-to-Permissions mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    // Full access to everything
    'dashboard.view',
    'dashboard.analytics',
    'projects.view',
    'projects.create',
    'projects.edit',
    'projects.delete',
    'apikeys.view',
    'apikeys.create',
    'apikeys.revoke',
    'apikeys.manage',
    'logs.view',
    'logs.export',
    'logs.delete',
    'webhooks.view',
    'webhooks.create',
    'webhooks.edit',
    'webhooks.delete',
    'customers.view',
    'customers.viewAll',
    'customers.edit',
    'customers.delete',
    'customers.export',
    'intelligence.view',
    'intelligence.viewAll',
    'intelligence.export',
    'compliance.view',
    'compliance.manage',
    'compliance.export',
    'reports.view',
    'reports.create',
    'reports.export',
    'reports.schedule',
    'billing.view',
    'billing.manage',
    'billing.viewInvoices',
    'billing.downloadInvoices',
    'team.view',
    'team.invite',
    'team.edit',
    'team.remove',
    'team.manageRoles',
    'support.view',
    'support.createTicket',
    'settings.view',
    'settings.edit',
    'settings.security',
    'settings.integrations',
    'settings.billing',
  ],

  partner: [
    // Partner has limited access
    'dashboard.view',
    'dashboard.analytics',
    'projects.view',
    'projects.create',
    'projects.edit',
    'apikeys.view',
    'apikeys.create',
    'apikeys.revoke',
    'logs.view',
    'logs.export',
    'webhooks.view',
    'webhooks.create',
    'webhooks.edit',
    'customers.view', // Only their own customers
    'intelligence.view', // Only their own data
    'compliance.view',
    'reports.view',
    'reports.create',
    'reports.export',
    'billing.view',
    'billing.viewInvoices',
    'billing.downloadInvoices',
    'team.view',
    'support.view',
    'support.createTicket',
    'settings.view',
    'settings.edit',
  ],

  user: [
    // Basic user has read-only access
    'dashboard.view',
    'projects.view',
    'apikeys.view',
    'logs.view',
    'webhooks.view',
    'customers.view',
    'intelligence.view',
    'compliance.view',
    'reports.view',
    'billing.view',
    'support.view',
    'support.createTicket',
    'settings.view',
  ],
}

// Check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

// Check if a role has any of the specified permissions
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission))
}

// Check if a role has all of the specified permissions
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission))
}

// Get all permissions for a role
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

// Route-to-Required-Permissions mapping
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/': ['dashboard.view'],
  '/projects': ['projects.view'],
  '/api-keys': ['apikeys.view'],
  '/logs': ['logs.view'],
  '/webhooks': ['webhooks.view'],
  '/customers': ['customers.view'],
  '/intelligence': ['intelligence.view'],
  '/compliance': ['compliance.view'],
  '/reports': ['reports.view'],
  '/billing': ['billing.view'],
  '/team': ['team.view'],
  '/support': ['support.view'],
  '/settings': ['settings.view'],
}

// Check if a role can access a specific route
export function canAccessRoute(role: Role, route: string): boolean {
  const requiredPermissions = ROUTE_PERMISSIONS[route]
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true // No permissions required, allow access
  }
  return hasAnyPermission(role, requiredPermissions)
}

// Feature flags based on permissions
export interface FeatureAccess {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canExport: boolean
  canManage: boolean
  canViewAll: boolean
}

export function getFeatureAccess(role: Role, feature: string): FeatureAccess {
  return {
    canCreate: hasPermission(role, `${feature}.create` as Permission),
    canEdit: hasPermission(role, `${feature}.edit` as Permission),
    canDelete: hasPermission(role, `${feature}.delete` as Permission),
    canExport: hasPermission(role, `${feature}.export` as Permission),
    canManage: hasPermission(role, `${feature}.manage` as Permission),
    canViewAll: hasPermission(role, `${feature}.viewAll` as Permission),
  }
}
