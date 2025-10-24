// Support & Help data source

export interface SupportTicket {
  id: string
  subject: string
  status: 'Open' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  createdAt: string
  updatedAt: string
  messages: {
    id: string
    author: string
    authorType: 'user' | 'support'
    message: string
    timestamp: string
    attachments?: string[]
  }[]
}

export interface KnowledgeArticle {
  id: string
  title: string
  category: string
  content: string
  helpful: number
  notHelpful: number
  views: number
  lastUpdated: string
  tags: string[]
}

export interface ArticleCategory {
  name: string
  icon: string
  articleCount: number
}

export interface SupportData {
  tickets: SupportTicket[]
  articles: KnowledgeArticle[]
  categories: ArticleCategory[]
}

// Mock data - replace with API calls
export const getSupportData = async (): Promise<SupportData> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    tickets: [
      {
        id: 'TKT-001',
        subject: 'API rate limit exceeded',
        status: 'Open',
        priority: 'High',
        createdAt: '2024-10-24 10:30',
        updatedAt: '2024-10-24 10:30',
        messages: [
          {
            id: '1',
            author: 'Abraham Jr',
            authorType: 'user',
            message:
              "I'm getting rate limit errors on the /forecast/generate endpoint. Our current limit is 1000 req/min but we're seeing errors at around 800 req/min.",
            timestamp: '2024-10-24 10:30',
          },
        ],
      },
      {
        id: 'TKT-002',
        subject: 'Webhook delivery failures',
        status: 'In Progress',
        priority: 'Medium',
        createdAt: '2024-10-23 14:20',
        updatedAt: '2024-10-24 09:15',
        messages: [
          {
            id: '1',
            author: 'Abraham Jr',
            authorType: 'user',
            message:
              'Our production webhook is failing to receive events. Last successful delivery was 2 hours ago.',
            timestamp: '2024-10-23 14:20',
          },
          {
            id: '2',
            author: 'Support Team',
            authorType: 'support',
            message:
              "We've identified the issue - your webhook endpoint is returning 500 errors. Can you check your server logs?",
            timestamp: '2024-10-24 09:15',
          },
        ],
      },
      {
        id: 'TKT-003',
        subject: 'How to export customer data?',
        status: 'Resolved',
        priority: 'Low',
        createdAt: '2024-10-22 11:45',
        updatedAt: '2024-10-22 16:30',
        messages: [
          {
            id: '1',
            author: 'Abraham Jr',
            authorType: 'user',
            message: 'What's the best way to export all customer persona data to CSV?',
            timestamp: '2024-10-22 11:45',
          },
          {
            id: '2',
            author: 'Support Team',
            authorType: 'support',
            message:
              'You can use the Reports module to generate a Customer Financial Profile report and select CSV format. Here's a guide: https://docs.sonaqor.ai/reports',
            timestamp: '2024-10-22 16:30',
          },
        ],
      },
    ],
    articles: [
      {
        id: '1',
        title: 'Getting Started with Sonaqor API',
        category: 'Getting Started',
        content:
          'Learn how to integrate Sonaqor API into your application. This guide covers authentication, making your first API call, and handling responses...',
        helpful: 245,
        notHelpful: 12,
        views: 3456,
        lastUpdated: '2024-10-15',
        tags: ['api', 'getting-started', 'authentication'],
      },
      {
        id: '2',
        title: 'Understanding Behavioral Personas',
        category: 'Intelligence',
        content:
          'Sonaqor analyzes customer transaction data to identify behavioral personas. This article explains each persona type, their characteristics, and how to use them...',
        helpful: 189,
        notHelpful: 8,
        views: 2134,
        lastUpdated: '2024-10-10',
        tags: ['personas', 'intelligence', 'analysis'],
      },
      {
        id: '3',
        title: 'Configuring Webhooks',
        category: 'Webhooks',
        content:
          'Set up webhooks to receive real-time notifications when analyses complete. Learn about event types, payload structure, and retry logic...',
        helpful: 167,
        notHelpful: 5,
        views: 1876,
        lastUpdated: '2024-10-12',
        tags: ['webhooks', 'events', 'integration'],
      },
      {
        id: '4',
        title: 'API Rate Limits and Best Practices',
        category: 'API',
        content:
          'Understand rate limits, implement exponential backoff, and optimize your API usage for better performance and reliability...',
        helpful: 203,
        notHelpful: 15,
        views: 2567,
        lastUpdated: '2024-10-18',
        tags: ['api', 'rate-limits', 'best-practices'],
      },
      {
        id: '5',
        title: 'Risk & Compliance Tools Guide',
        category: 'Compliance',
        content:
          'Use Sonaqor's risk and compliance tools to detect anomalies, screen for PEP/sanctions, and generate SAR reports. Complete guide with examples...',
        helpful: 134,
        notHelpful: 7,
        views: 1456,
        lastUpdated: '2024-10-08',
        tags: ['compliance', 'risk', 'sar', 'pep'],
      },
    ],
    categories: [
      { name: 'Getting Started', icon: 'BookOpen', articleCount: 8 },
      { name: 'API', icon: 'Code', articleCount: 15 },
      { name: 'Intelligence', icon: 'Brain', articleCount: 12 },
      { name: 'Webhooks', icon: 'Webhook', articleCount: 6 },
      { name: 'Compliance', icon: 'Shield', articleCount: 10 },
      { name: 'Billing', icon: 'CreditCard', articleCount: 5 },
      { name: 'Troubleshooting', icon: 'AlertCircle', articleCount: 20 },
    ],
  }
}

export const createTicket = async (
  subject: string,
  description: string,
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
): Promise<SupportTicket> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: `TKT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    subject,
    status: 'Open',
    priority,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: '1',
        author: 'Abraham Jr',
        authorType: 'user',
        message: description,
        timestamp: new Date().toISOString(),
      },
    ],
  }
}

export const searchArticles = async (query: string): Promise<KnowledgeArticle[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const data = await getSupportData()
  if (!query) return data.articles

  const lowerQuery = query.toLowerCase()
  return data.articles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  )
}
