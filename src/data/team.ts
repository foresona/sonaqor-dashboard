// Team page data source

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Developer' | 'Viewer'
  status: 'Active' | 'Invited'
  joinedDate: string
  avatar?: string
}

export interface TeamData {
  members: TeamMember[]
  rolePermissions: {
    role: string
    permissions: string[]
  }[]
}

// Mock data - replace with API calls
export const getTeamData = async (): Promise<TeamData> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    members: [
      {
        id: '1',
        name: 'Abraham Jr',
        email: 'abraham@example.com',
        role: 'Owner',
        status: 'Active',
        joinedDate: '2024-01-15',
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'Admin',
        status: 'Active',
        joinedDate: '2024-02-20',
      },
      {
        id: '3',
        name: 'Michael Chen',
        email: 'michael@example.com',
        role: 'Developer',
        status: 'Active',
        joinedDate: '2024-03-10',
      },
      {
        id: '4',
        name: 'Emily Davis',
        email: 'emily@example.com',
        role: 'Developer',
        status: 'Invited',
        joinedDate: '2024-10-20',
      },
      {
        id: '5',
        name: 'David Wilson',
        email: 'david@example.com',
        role: 'Viewer',
        status: 'Active',
        joinedDate: '2024-09-05',
      },
    ],
    rolePermissions: [
      {
        role: 'Owner',
        permissions: [
          'Full access to all features',
          'Manage billing',
          'Delete organization',
          'Manage team members',
        ],
      },
      {
        role: 'Admin',
        permissions: [
          'Manage API keys',
          'Configure webhooks',
          'View all logs',
          'Manage team members',
        ],
      },
      {
        role: 'Developer',
        permissions: ['Create API keys', 'View logs', 'Test webhooks', 'Read analytics'],
      },
      {
        role: 'Viewer',
        permissions: ['View dashboard', 'Read analytics', 'View logs'],
      },
    ],
  }
}
