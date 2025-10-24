// API Keys page data source

export interface APIKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string
  status: 'Active' | 'Revoked'
  permissions: string[]
  requestsToday: number
}

export interface APIKeyUsageStats {
  totalKeys: number
  activeKeys: number
  revokedKeys: number
  totalRequests: number
}

export interface APIKeysData {
  keys: APIKey[]
  stats: APIKeyUsageStats
}

// Mock data - replace with API calls
export const getAPIKeysData = async (): Promise<APIKeysData> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    keys: [
      {
        id: '1',
        name: 'Production API Key',
        key: 'sk_live_51MqXK2N...',
        createdAt: '2024-01-15',
        lastUsed: '2 minutes ago',
        status: 'Active',
        permissions: ['forecast.generate', 'persona.match', 'fscores.calculate'],
        requestsToday: 1247,
      },
      {
        id: '2',
        name: 'Development API Key',
        key: 'sk_test_51MqXK2N...',
        createdAt: '2024-02-20',
        lastUsed: '1 hour ago',
        status: 'Active',
        permissions: ['forecast.generate', 'persona.match'],
        requestsToday: 342,
      },
      {
        id: '3',
        name: 'Staging Environment',
        key: 'sk_test_51NqYL3O...',
        createdAt: '2024-03-10',
        lastUsed: '3 days ago',
        status: 'Active',
        permissions: ['forecast.generate', 'fscores.calculate', 'anomaly.detect'],
        requestsToday: 89,
      },
      {
        id: '4',
        name: 'Old Testing Key',
        key: 'sk_test_51LpZM4P...',
        createdAt: '2023-12-05',
        lastUsed: '30 days ago',
        status: 'Revoked',
        permissions: ['forecast.generate'],
        requestsToday: 0,
      },
      {
        id: '5',
        name: 'Mobile App Key',
        key: 'sk_live_51OqAB5Q...',
        createdAt: '2024-08-15',
        lastUsed: '10 minutes ago',
        status: 'Active',
        permissions: ['persona.match', 'fscores.calculate'],
        requestsToday: 523,
      },
    ],
    stats: {
      totalKeys: 5,
      activeKeys: 4,
      revokedKeys: 1,
      totalRequests: 2201,
    },
  }
}
