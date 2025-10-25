# RBAC (Role-Based Access Control) Implementation

This dashboard now includes a comprehensive RBAC system to control access to features and data based on user roles.

## Features

✅ **Three User Roles**: Admin, Partner, and User
✅ **Granular Permissions**: 60+ permissions across all features
✅ **Route Protection**: Automatic route-level access control
✅ **Component-Level Guards**: Show/hide UI elements based on permissions
✅ **React Hooks**: Easy-to-use hooks for permission checks
✅ **Protected Components**: Declarative permission-based rendering

## User Roles

### Admin

- **Full Access** to all features and data
- Can manage team members and roles
- Can view and edit all settings
- Can delete data and manage billing

### Partner

- **Limited Access** to partner-specific features
- Can create and manage own projects
- Can view logs and create webhooks
- Cannot delete data or manage team
- Cannot access all customer data

### User (Read-Only)

- **View-Only Access** to most features
- Can view dashboard and reports
- Can create support tickets
- Cannot create, edit, or delete data
- Cannot access team or billing management

## Demo Accounts

```
Admin:   admin@sonaqor.com / admin123
Partner: partner@example.com / partner123
User:    user@example.com / user123
```

## Permission System

### Permission Categories

The system includes 60+ permissions organized by feature:

- **Dashboard**: `dashboard.view`, `dashboard.analytics`
- **Projects**: `projects.view`, `projects.create`, `projects.edit`, `projects.delete`
- **API Keys**: `apikeys.view`, `apikeys.create`, `apikeys.revoke`, `apikeys.manage`
- **Logs**: `logs.view`, `logs.export`, `logs.delete`
- **Webhooks**: `webhooks.view`, `webhooks.create`, `webhooks.edit`, `webhooks.delete`
- **Customers**: `customers.view`, `customers.viewAll`, `customers.edit`, `customers.delete`, `customers.export`
- **Intelligence**: `intelligence.view`, `intelligence.viewAll`, `intelligence.export`
- **Compliance**: `compliance.view`, `compliance.manage`, `compliance.export`
- **Reports**: `reports.view`, `reports.create`, `reports.export`, `reports.schedule`
- **Billing**: `billing.view`, `billing.manage`, `billing.viewInvoices`, `billing.downloadInvoices`
- **Team**: `team.view`, `team.invite`, `team.edit`, `team.remove`, `team.manageRoles`
- **Support**: `support.view`, `support.createTicket`
- **Settings**: `settings.view`, `settings.edit`, `settings.security`, `settings.integrations`, `settings.billing`

### Full Permission Matrix

| Permission          | Admin | Partner | User |
| ------------------- | ----- | ------- | ---- |
| dashboard.view      | ✅    | ✅      | ✅   |
| dashboard.analytics | ✅    | ✅      | ❌   |
| projects.create     | ✅    | ✅      | ❌   |
| projects.delete     | ✅    | ❌      | ❌   |
| apikeys.manage      | ✅    | ❌      | ❌   |
| logs.delete         | ✅    | ❌      | ❌   |
| customers.viewAll   | ✅    | ❌      | ❌   |
| billing.manage      | ✅    | ❌      | ❌   |
| team.manageRoles    | ✅    | ❌      | ❌   |
| settings.security   | ✅    | ❌      | ❌   |

_See `src/lib/rbac.ts` for the complete permission matrix_

## Usage

### 1. Using React Hooks

```typescript
import { usePermission, useFeatureAccess, useIsAdmin } from '@/hooks/useRBAC'

function MyComponent() {
  // Check single permission
  const canCreateProject = usePermission('projects.create')

  // Check if user is admin
  const isAdmin = useIsAdmin()

  // Get all feature permissions at once
  const projectAccess = useFeatureAccess('projects')
  // Returns: { canCreate, canEdit, canDelete, canExport, canManage, canViewAll }

  return (
    <div>
      {canCreateProject && <CreateProjectButton />}
      {projectAccess.canDelete && <DeleteButton />}
      {isAdmin && <AdminPanel />}
    </div>
  )
}
```

### 2. Using Protected Component

```typescript
import { Protected } from '@/components/Protected'

function MyPage() {
  return (
    <div>
      {/* Show only if user has permission */}
      <Protected permission="projects.create">
        <CreateProjectButton />
      </Protected>

      {/* Show if user has ANY of these permissions */}
      <Protected anyPermissions={['projects.edit', 'projects.delete']}>
        <EditControls />
      </Protected>

      {/* Show if user has ALL of these permissions */}
      <Protected allPermissions={['team.view', 'team.manageRoles']}>
        <RoleManagement />
      </Protected>

      {/* Show fallback if no permission */}
      <Protected permission="billing.manage" fallback={<UpgradeBanner />}>
        <BillingSettings />
      </Protected>
    </div>
  )
}
```

### 3. Using Restricted Component (Inverse)

```typescript
import { Restricted } from '@/components/Protected'

function MyPage() {
  return (
    <div>
      {/* Show ONLY if user does NOT have permission */}
      <Restricted permission="billing.manage">
        <UpgradeToPremiumBanner />
      </Restricted>

      <Restricted permission="team.manageRoles">
        <ContactAdminMessage />
      </Restricted>
    </div>
  )
}
```

### 4. Programmatic Permission Checks

```typescript
import { hasPermission, canAccessRoute } from '@/lib/rbac'
import { useAuthStore } from '@/store/authStore'

function MyComponent() {
  const { user } = useAuthStore()

  const handleAction = () => {
    if (!user) return

    // Check single permission
    if (hasPermission(user.role, 'projects.create')) {
      // Create project
    }

    // Check route access
    if (canAccessRoute(user.role, '/team')) {
      router.push('/team')
    }
  }
}
```

### 5. Available Hooks

```typescript
// Permission checks
usePermission(permission: Permission): boolean
useAnyPermission(permissions: Permission[]): boolean
useAllPermissions(permissions: Permission[]): boolean

// Route access
useCanAccessRoute(route: string): boolean

// Feature access (returns object with canCreate, canEdit, etc.)
useFeatureAccess(feature: string): FeatureAccess

// Get all permissions
useUserPermissions(): Permission[]

// Role checks
useUserRole(): Role | null
useIsAdmin(): boolean
useIsPartner(): boolean
useIsUser(): boolean
```

## Example: API Keys Page with RBAC

```typescript
'use client'

import { useFeatureAccess } from '@/hooks/useRBAC'
import { Protected } from '@/components/Protected'

export default function APIKeysPage() {
  const apiKeyAccess = useFeatureAccess('apikeys')

  return (
    <div>
      <h1>API Keys</h1>

      {/* Only show create button if user can create */}
      <Protected permission="apikeys.create">
        <button>Create New API Key</button>
      </Protected>

      <table>
        {apiKeys.map((key) => (
          <tr key={key.id}>
            <td>{key.name}</td>
            <td>
              {/* Only show revoke if user can revoke */}
              {apiKeyAccess.canManage && <button onClick={() => revokeKey(key.id)}>Revoke</button>}
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}
```

## Example: Conditional Navigation

```typescript
import { useCanAccessRoute } from '@/hooks/useRBAC'

function Sidebar() {
  const canViewTeam = useCanAccessRoute('/team')
  const canViewBilling = useCanAccessRoute('/billing')

  return (
    <nav>
      <Link href="/">Dashboard</Link>
      <Link href="/projects">Projects</Link>

      {canViewTeam && <Link href="/team">Team</Link>}
      {canViewBilling && <Link href="/billing">Billing</Link>}
    </nav>
  )
}
```

## File Structure

```
src/
├── lib/
│   └── rbac.ts                    # Core RBAC logic and permissions
├── hooks/
│   └── useRBAC.ts                 # React hooks for RBAC
├── components/
│   └── Protected.tsx              # Protected/Restricted components
└── middleware.ts                  # Route-level protection
```

## Extending RBAC

### Adding New Permissions

1. Add permission to type in `src/lib/rbac.ts`:

```typescript
export type Permission =
  | 'existing.permission'
  | 'newfeature.view' // Add here
  | 'newfeature.create'
```

2. Add to role permissions:

```typescript
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    // ... existing permissions
    'newfeature.view',
    'newfeature.create',
  ],
  partner: ['newfeature.view'],
  user: ['newfeature.view'],
}
```

3. Add route mapping if needed:

```typescript
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/newfeature': ['newfeature.view'],
}
```

### Adding New Roles

1. Update Role type in `src/lib/auth.ts`:

```typescript
export interface User {
  role: 'admin' | 'partner' | 'user' | 'newrole'
}
```

2. Add role permissions in `src/lib/rbac.ts`:

```typescript
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  // ... existing roles
  newrole: [
    'dashboard.view',
    // ... role-specific permissions
  ],
}
```

## Security Considerations

### Current Implementation

- ✅ Client-side permission checks
- ✅ Route-level protection
- ✅ Component-level guards
- ⚠️ No server-side API validation (needs backend)

### Production Recommendations

1. **Backend Validation**: Always validate permissions on the server

```typescript
// API endpoint example
app.post('/api/projects', authenticate, authorize(['projects.create']), createProject)
```

2. **Token-Based Permissions**: Include permissions in JWT token

```typescript
// JWT payload
{
  userId: '123',
  role: 'partner',
  permissions: ['projects.create', 'projects.view'],
  organizationId: 'org-1'
}
```

3. **Audit Logging**: Log permission-based actions

```typescript
await auditLog.create({
  userId: user.id,
  action: 'project.create',
  permission: 'projects.create',
  timestamp: new Date(),
})
```

4. **Dynamic Permissions**: Load permissions from database

```typescript
// Instead of static ROLE_PERMISSIONS
const permissions = await db.rolePermissions.findMany({
  where: { roleId: user.roleId },
})
```

5. **Organization-Level Permissions**: Scope permissions by organization

```typescript
// Check if user can access resource
if (resource.organizationId !== user.organizationId) {
  throw new ForbiddenError()
}
```

## Testing RBAC

### Test Different Roles

1. Log in as Admin (`admin@sonaqor.com / admin123`)
   - You should see all features and controls
2. Log in as Partner (`partner@example.com / partner123`)
   - Create buttons visible
   - Some admin features hidden
   - Cannot delete data
3. Log in as User (`user@example.com / user123`)
   - View-only access
   - No create/edit/delete buttons
   - Support ticket creation available

### Verify Permissions

Check the browser console:

```javascript
// In browser console
const { user } = useAuthStore.getState()
console.log('Role:', user.role)
console.log('Permissions:', getRolePermissions(user.role))
```

## Troubleshooting

### Permission Check Not Working

- Ensure user is authenticated
- Check if permission is spelled correctly
- Verify role has the permission in `ROLE_PERMISSIONS`

### Component Still Visible

- Check if using `<Protected>` or `<Restricted>` correctly
- Verify permission prop matches actual permission name
- Check browser console for errors

### Route Access Denied

- Verify route is in `ROUTE_PERMISSIONS`
- Check if user role has required permission
- Clear localStorage and re-login

## Migration Guide

To integrate RBAC into existing pages:

1. **Import hooks**:

```typescript
import { useFeatureAccess } from '@/hooks/useRBAC'
import { Protected } from '@/components/Protected'
```

2. **Wrap action buttons**:

```typescript
<Protected permission="feature.create">
  <CreateButton />
</Protected>
```

3. **Use feature access**:

```typescript
const access = useFeatureAccess('feature')
if (access.canEdit) {
  // Show edit UI
}
```

4. **Update navigation**:

```typescript
import { useCanAccessRoute } from '@/hooks/useRBAC'
const canAccess = useCanAccessRoute('/admin')
```

## Future Enhancements

- [ ] Dynamic role and permission management UI
- [ ] Permission inheritance and role hierarchy
- [ ] Resource-level permissions (per-project, per-customer)
- [ ] Time-based permissions (temporary access)
- [ ] Permission delegation
- [ ] Activity-based permissions (based on user actions)
- [ ] Integration with external identity providers (OAuth, SAML)
- [ ] Permission analytics and usage tracking
