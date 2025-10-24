// Webhooks page data source

export interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  status: 'active' | 'inactive'
  lastTriggered: string
  successRate: number
  totalCalls: number
}

export interface WebhookDelivery {
  id: number
  event: string
  webhook: string
  status: 'success' | 'failed'
  statusCode: number
  timestamp: string
  duration: string
  payload: any
  response: any
}

export interface AvailableEvent {
  name: string
  desc: string
}

export interface WebhooksData {
  stats: {
    total: number
    active: number
    successRate: number
    totalDeliveries: string
  }
  webhooks: WebhookConfig[]
  deliveries: WebhookDelivery[]
  availableEvents: AvailableEvent[]
}

// Mock data - replace with API calls
export const getWebhooksData = async (): Promise<WebhooksData> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    stats: {
      total: 3,
      active: 2,
      successRate: 94.7,
      totalDeliveries: '24.8K',
    },
    webhooks: [
      {
        id: '1',
        name: 'Production Webhook',
        url: 'https://api.yourapp.com/webhooks/forecast',
        events: ['forecast.generated', 'anomaly.detected'],
        status: 'active',
        lastTriggered: '2 mins ago',
        successRate: 98.5,
        totalCalls: 12450,
      },
      {
        id: '2',
        name: 'Staging Environment',
        url: 'https://staging.yourapp.com/hooks',
        events: ['forecast.generated', 'fscores.calculated'],
        status: 'active',
        lastTriggered: '15 mins ago',
        successRate: 100,
        totalCalls: 8230,
      },
      {
        id: '3',
        name: 'Development Server',
        url: 'https://dev.yourapp.com/webhooks',
        events: ['*'],
        status: 'inactive',
        lastTriggered: '2 days ago',
        successRate: 85.2,
        totalCalls: 4120,
      },
    ],
    deliveries: Array.from({ length: 20 }, (_, i) => ({
      id: i,
      event: ['forecast.generated', 'anomaly.detected', 'fscores.calculated', 'persona.matched'][
        i % 4
      ],
      webhook: ['Production Webhook', 'Staging Environment', 'Development Server'][i % 3],
      status: i % 10 === 0 ? 'failed' : 'success',
      statusCode: i % 10 === 0 ? 500 : 200,
      timestamp: `2025-10-24 ${14 + Math.floor(i / 4)}:${(i * 3) % 60}:${(i * 7) % 60}`,
      duration: `${180 + i * 15}ms`,
      payload: {
        userId: `user_${1000 + i}`,
        timestamp: new Date().toISOString(),
        data: {
          forecast: {
            personality_type: ['INTJ', 'ENFP', 'ISTJ', 'ESFP'][i % 4],
            confidence: 0.85 + (i % 10) * 0.01,
            trends: ['analytical', 'creative', 'structured', 'spontaneous'][i % 4],
          },
        },
      },
      response: {
        status: i % 10 === 0 ? 'error' : 'success',
        message: i % 10 === 0 ? 'Internal server error' : 'Webhook processed successfully',
        processedAt: new Date().toISOString(),
      },
    })),
    availableEvents: [
      { name: 'forecast.generated', desc: 'Triggered when a new persona forecast is generated' },
      { name: 'anomaly.detected', desc: 'Fired when an anomaly is detected in user behavior' },
      { name: 'fscores.calculated', desc: 'Emitted after F_scores are calculated for a user' },
      { name: 'persona.matched', desc: 'Sent when a persona match is found' },
      { name: 'insights.updated', desc: 'Triggered when user insights are refreshed' },
    ],
  }
}
