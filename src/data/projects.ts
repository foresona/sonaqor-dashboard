// Projects & Apps data source

export interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  appCount: number
  status: 'Active' | 'Inactive'
}

export interface App {
  id: string
  projectId: string
  name: string
  environment: 'Production' | 'Staging' | 'Development'
  status: 'Active' | 'Inactive'
  apiCalls: number
  webhooks: number
  lastUsed: string
  createdAt: string
  ipWhitelist: string[]
  rateLimit: number
}

export interface ProjectStats {
  totalProjects: number
  totalApps: number
  activeApps: number
  totalApiCalls: number
}

export interface ProjectsData {
  projects: Project[]
  apps: App[]
  stats: ProjectStats
}

// Mock data - replace with API calls
export const getProjectsData = async (): Promise<ProjectsData> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    projects: [
      {
        id: '1',
        name: 'Production Infrastructure',
        description: 'Main production environment for customer-facing applications',
        createdAt: '2024-01-15',
        appCount: 3,
        status: 'Active',
      },
      {
        id: '2',
        name: 'Testing & QA',
        description: 'Quality assurance and testing environment',
        createdAt: '2024-03-20',
        appCount: 2,
        status: 'Active',
      },
      {
        id: '3',
        name: 'Development Sandbox',
        description: 'Development and experimentation environment',
        createdAt: '2024-05-10',
        appCount: 2,
        status: 'Active',
      },
    ],
    apps: [
      {
        id: '1',
        projectId: '1',
        name: 'Main Web App',
        environment: 'Production',
        status: 'Active',
        apiCalls: 45234,
        webhooks: 3,
        lastUsed: '2 minutes ago',
        createdAt: '2024-01-15',
        ipWhitelist: ['192.168.1.1', '10.0.0.0/24'],
        rateLimit: 1000,
      },
      {
        id: '2',
        projectId: '1',
        name: 'Mobile App Backend',
        environment: 'Production',
        status: 'Active',
        apiCalls: 32145,
        webhooks: 2,
        lastUsed: '5 minutes ago',
        createdAt: '2024-02-01',
        ipWhitelist: ['203.0.113.0/24'],
        rateLimit: 500,
      },
      {
        id: '3',
        projectId: '1',
        name: 'Analytics Service',
        environment: 'Production',
        status: 'Active',
        apiCalls: 18923,
        webhooks: 1,
        lastUsed: '1 hour ago',
        createdAt: '2024-03-15',
        ipWhitelist: [],
        rateLimit: 200,
      },
      {
        id: '4',
        projectId: '2',
        name: 'QA Test Suite',
        environment: 'Staging',
        status: 'Active',
        apiCalls: 5432,
        webhooks: 1,
        lastUsed: '3 hours ago',
        createdAt: '2024-03-20',
        ipWhitelist: ['172.16.0.0/12'],
        rateLimit: 100,
      },
      {
        id: '5',
        projectId: '2',
        name: 'Integration Tests',
        environment: 'Staging',
        status: 'Active',
        apiCalls: 2156,
        webhooks: 0,
        lastUsed: '1 day ago',
        createdAt: '2024-04-05',
        ipWhitelist: [],
        rateLimit: 50,
      },
      {
        id: '6',
        projectId: '3',
        name: 'Dev Playground',
        environment: 'Development',
        status: 'Active',
        apiCalls: 1234,
        webhooks: 2,
        lastUsed: '10 minutes ago',
        createdAt: '2024-05-10',
        ipWhitelist: [],
        rateLimit: 1000,
      },
      {
        id: '7',
        projectId: '3',
        name: 'Prototype App',
        environment: 'Development',
        status: 'Inactive',
        apiCalls: 234,
        webhooks: 0,
        lastUsed: '7 days ago',
        createdAt: '2024-06-01',
        ipWhitelist: [],
        rateLimit: 100,
      },
    ],
    stats: {
      totalProjects: 3,
      totalApps: 7,
      activeApps: 6,
      totalApiCalls: 105358,
    },
  }
}

export const getAppDetails = async (appId: string): Promise<App | null> => {
  const data = await getProjectsData()
  return data.apps.find((app) => app.id === appId) || null
}
