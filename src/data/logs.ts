// API Logs page data source

export interface APILogEntry {
  id: string
  timestamp: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  endpoint: string
  status: number
  duration: string
  ip: string
  apiKey: string
  requestHeaders: Record<string, string>
  requestBody: any
  responseBody: any
}

export interface LogsData {
  stats: {
    totalRequests: string
    successRate: number
    avgResponse: string
    errors: number
  }
  logs: APILogEntry[]
}

// Mock data - replace with API calls
export const getLogsData = async (
  searchQuery: string = '',
  statusFilter: string = 'all',
): Promise<LogsData> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const allLogs: APILogEntry[] = [
    {
      id: '1',
      timestamp: '2025-10-24 14:32:15',
      method: 'POST',
      endpoint: '/api/forecast/generate',
      status: 200,
      duration: '1.2s',
      ip: '192.168.1.100',
      apiKey: 'sk_live_***abc123',
      requestHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_live_***abc123',
        'User-Agent': 'Mozilla/5.0',
      },
      requestBody: {
        userId: 'user_1234',
        period: '30d',
        includeInsights: true,
      },
      responseBody: {
        success: true,
        forecast: {
          personality_type: 'INTJ',
          confidence: 0.87,
          trends: ['analytical', 'strategic'],
        },
      },
    },
    {
      id: '2',
      timestamp: '2025-10-24 14:31:42',
      method: 'GET',
      endpoint: '/api/persona/match',
      status: 200,
      duration: '845ms',
      ip: '192.168.1.101',
      apiKey: 'sk_test_***def456',
      requestHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_test_***def456',
      },
      requestBody: null,
      responseBody: {
        matches: [
          { userId: 'user_5678', similarity: 0.92 },
          { userId: 'user_9012', similarity: 0.88 },
        ],
      },
    },
    {
      id: '3',
      timestamp: '2025-10-24 14:30:18',
      method: 'POST',
      endpoint: '/api/fscores/calculate',
      status: 500,
      duration: '2.1s',
      ip: '192.168.1.102',
      apiKey: 'sk_live_***ghi789',
      requestHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_live_***ghi789',
      },
      requestBody: {
        userId: 'user_3456',
        metrics: ['engagement', 'retention'],
      },
      responseBody: {
        error: 'Internal server error',
        message: 'Failed to calculate F_scores',
      },
    },
    {
      id: '4',
      timestamp: '2025-10-24 14:29:05',
      method: 'GET',
      endpoint: '/api/anomaly/detect',
      status: 200,
      duration: '650ms',
      ip: '192.168.1.103',
      apiKey: 'sk_live_***jkl012',
      requestHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_live_***jkl012',
      },
      requestBody: null,
      responseBody: {
        anomalies: [],
        confidence: 0.95,
      },
    },
    {
      id: '5',
      timestamp: '2025-10-24 14:28:33',
      method: 'PUT',
      endpoint: '/api/user/preferences',
      status: 200,
      duration: '420ms',
      ip: '192.168.1.104',
      apiKey: 'sk_live_***mno345',
      requestHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_live_***mno345',
      },
      requestBody: {
        notifications: true,
        theme: 'dark',
      },
      responseBody: {
        success: true,
        updated: true,
      },
    },
    {
      id: '6',
      timestamp: '2025-10-24 14:27:11',
      method: 'DELETE',
      endpoint: '/api/webhook/delete',
      status: 404,
      duration: '180ms',
      ip: '192.168.1.105',
      apiKey: 'sk_test_***pqr678',
      requestHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_test_***pqr678',
      },
      requestBody: {
        webhookId: 'webhook_999',
      },
      responseBody: {
        error: 'Webhook not found',
      },
    },
  ]

  // Filter logs based on search and status
  let filtered = allLogs

  if (searchQuery) {
    filtered = filtered.filter(
      (log) =>
        log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ip.includes(searchQuery),
    )
  }

  if (statusFilter === '2xx') {
    filtered = filtered.filter((log) => log.status >= 200 && log.status < 300)
  } else if (statusFilter === '4xx') {
    filtered = filtered.filter((log) => log.status >= 400 && log.status < 500)
  } else if (statusFilter === '5xx') {
    filtered = filtered.filter((log) => log.status >= 500 && log.status < 600)
  }

  return {
    stats: {
      totalRequests: '45,234',
      successRate: 99.2,
      avgResponse: '1.2s',
      errors: 342,
    },
    logs: filtered,
  }
}
