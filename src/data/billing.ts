// Billing & Account data source (extends settings.ts billing info)

export interface BillingPlan {
  name: string
  tier: 'Free' | 'Starter' | 'Pro' | 'Enterprise'
  pricing: {
    monthly: number
    yearly: number
  }
  limits: {
    apiCalls: number
    customers: number
    storage: string
    teamMembers: number
  }
  features: string[]
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: 'Paid' | 'Pending' | 'Overdue' | 'Failed'
  pdfUrl: string
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  paymentMethod: string
}

export interface UsageMetrics {
  apiCalls: {
    current: number
    limit: number
    percentage: number
  }
  customers: {
    current: number
    limit: number
    percentage: number
  }
  storage: {
    current: string
    limit: string
    percentage: number
  }
  bandwidth: {
    current: string
    limit: string
    percentage: number
  }
}

export interface UsageHistory {
  month: string
  period: string
  apiCalls: {
    used: number
    limit: number
    percentage: number
  }
  customers: {
    used: number
    limit: number
    percentage: number
  }
  storage: {
    used: string
    limit: string
    percentage: number
  }
  bandwidth: {
    used: string
    limit: string
    percentage: number
  }
  cost: number
  overages: number
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank'
  last4: string
  expiryDate?: string
  bankName?: string
  isDefault: boolean
  addedAt: string
}

export interface OverageAlert {
  id: string
  metric: string
  currentUsage: number
  limit: number
  percentage: number
  severity: 'Warning' | 'Critical'
  timestamp: string
}

export interface BillingData {
  currentPlan: BillingPlan
  availablePlans: BillingPlan[]
  usage: UsageMetrics
  usageHistory: UsageHistory[]
  invoices: Invoice[]
  paymentMethods: PaymentMethod[]
  alerts: OverageAlert[]
  nextBillingDate: string
  billingCycle: 'Monthly' | 'Yearly'
}

// Mock data - replace with API calls
export const getBillingData = async (): Promise<BillingData> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const plans: BillingPlan[] = [
    {
      name: 'Free',
      tier: 'Free',
      pricing: { monthly: 0, yearly: 0 },
      limits: {
        apiCalls: 1000,
        customers: 100,
        storage: '1 GB',
        teamMembers: 1,
      },
      features: ['Basic API Access', 'Community Support', '7-day Data Retention'],
    },
    {
      name: 'Starter',
      tier: 'Starter',
      pricing: { monthly: 99, yearly: 950 },
      limits: {
        apiCalls: 50000,
        customers: 5000,
        storage: '10 GB',
        teamMembers: 5,
      },
      features: [
        'Full API Access',
        'Email Support',
        '30-day Data Retention',
        'Basic Analytics',
        'Webhook Support',
      ],
    },
    {
      name: 'Pro',
      tier: 'Pro',
      pricing: { monthly: 299, yearly: 2870 },
      limits: {
        apiCalls: 250000,
        customers: 25000,
        storage: '50 GB',
        teamMembers: 15,
      },
      features: [
        'Everything in Starter',
        'Priority Support',
        '90-day Data Retention',
        'Advanced Analytics',
        'Custom Reports',
        'SLA Guarantee',
      ],
    },
    {
      name: 'Enterprise',
      tier: 'Enterprise',
      pricing: { monthly: 999, yearly: 9590 },
      limits: {
        apiCalls: -1, // Unlimited
        customers: -1,
        storage: '500 GB',
        teamMembers: -1,
      },
      features: [
        'Everything in Pro',
        '24/7 Dedicated Support',
        'Unlimited Data Retention',
        'Custom Integrations',
        'On-premise Deployment Option',
        'Custom SLA',
      ],
    },
  ]

  return {
    currentPlan: plans[2], // Pro plan
    availablePlans: plans,
    usage: {
      apiCalls: {
        current: 105358,
        limit: 250000,
        percentage: 42.1,
      },
      customers: {
        current: 8610,
        limit: 25000,
        percentage: 34.4,
      },
      storage: {
        current: '18.5 GB',
        limit: '50 GB',
        percentage: 37.0,
      },
      bandwidth: {
        current: '142 GB',
        limit: '500 GB',
        percentage: 28.4,
      },
    },
    usageHistory: [
      {
        month: 'October 2025',
        period: 'Oct 1 - Oct 31, 2025',
        apiCalls: { used: 105358, limit: 250000, percentage: 42.1 },
        customers: { used: 8610, limit: 25000, percentage: 34.4 },
        storage: { used: '18.5 GB', limit: '50 GB', percentage: 37.0 },
        bandwidth: { used: '142 GB', limit: '500 GB', percentage: 28.4 },
        cost: 299.0,
        overages: 0,
      },
      {
        month: 'September 2025',
        period: 'Sep 1 - Sep 30, 2025',
        apiCalls: { used: 187234, limit: 250000, percentage: 74.9 },
        customers: { used: 7892, limit: 25000, percentage: 31.6 },
        storage: { used: '16.2 GB', limit: '50 GB', percentage: 32.4 },
        bandwidth: { used: '198 GB', limit: '500 GB', percentage: 39.6 },
        cost: 299.0,
        overages: 0,
      },
      {
        month: 'August 2025',
        period: 'Aug 1 - Aug 31, 2025',
        apiCalls: { used: 264892, limit: 250000, percentage: 106.0 },
        customers: { used: 7234, limit: 25000, percentage: 28.9 },
        storage: { used: '14.8 GB', limit: '50 GB', percentage: 29.6 },
        bandwidth: { used: '176 GB', limit: '500 GB', percentage: 35.2 },
        cost: 314.89,
        overages: 15.89,
      },
      {
        month: 'July 2025',
        period: 'Jul 1 - Jul 31, 2025',
        apiCalls: { used: 156782, limit: 250000, percentage: 62.7 },
        customers: { used: 6789, limit: 25000, percentage: 27.2 },
        storage: { used: '13.1 GB', limit: '50 GB', percentage: 26.2 },
        bandwidth: { used: '154 GB', limit: '500 GB', percentage: 30.8 },
        cost: 299.0,
        overages: 0,
      },
      {
        month: 'June 2025',
        period: 'Jun 1 - Jun 30, 2025',
        apiCalls: { used: 198456, limit: 250000, percentage: 79.4 },
        customers: { used: 6234, limit: 25000, percentage: 24.9 },
        storage: { used: '11.9 GB', limit: '50 GB', percentage: 23.8 },
        bandwidth: { used: '132 GB', limit: '500 GB', percentage: 26.4 },
        cost: 299.0,
        overages: 0,
      },
      {
        month: 'May 2025',
        period: 'May 1 - May 31, 2025',
        apiCalls: { used: 289123, limit: 250000, percentage: 115.6 },
        customers: { used: 5897, limit: 25000, percentage: 23.6 },
        storage: { used: '10.4 GB', limit: '50 GB', percentage: 20.8 },
        bandwidth: { used: '125 GB', limit: '500 GB', percentage: 25.0 },
        cost: 338.12,
        overages: 39.12,
      },
      {
        month: 'April 2025',
        period: 'Apr 1 - Apr 30, 2025',
        apiCalls: { used: 142567, limit: 250000, percentage: 57.0 },
        customers: { used: 5234, limit: 25000, percentage: 20.9 },
        storage: { used: '9.2 GB', limit: '50 GB', percentage: 18.4 },
        bandwidth: { used: '98 GB', limit: '500 GB', percentage: 19.6 },
        cost: 299.0,
        overages: 0,
      },
      {
        month: 'March 2025',
        period: 'Mar 1 - Mar 31, 2025',
        apiCalls: { used: 134892, limit: 250000, percentage: 53.96 },
        customers: { used: 4789, limit: 25000, percentage: 19.2 },
        storage: { used: '8.1 GB', limit: '50 GB', percentage: 16.2 },
        bandwidth: { used: '87 GB', limit: '500 GB', percentage: 17.4 },
        cost: 299.0,
        overages: 0,
      },
      {
        month: 'February 2025',
        period: 'Feb 1 - Feb 28, 2025',
        apiCalls: { used: 118234, limit: 250000, percentage: 47.3 },
        customers: { used: 4123, limit: 25000, percentage: 16.5 },
        storage: { used: '7.3 GB', limit: '50 GB', percentage: 14.6 },
        bandwidth: { used: '76 GB', limit: '500 GB', percentage: 15.2 },
        cost: 299.0,
        overages: 0,
      },
      {
        month: 'January 2025',
        period: 'Jan 1 - Jan 31, 2025',
        apiCalls: { used: 95678, limit: 250000, percentage: 38.3 },
        customers: { used: 3567, limit: 25000, percentage: 14.3 },
        storage: { used: '6.2 GB', limit: '50 GB', percentage: 12.4 },
        bandwidth: { used: '64 GB', limit: '500 GB', percentage: 12.8 },
        cost: 299.0,
        overages: 0,
      },
      {
        month: 'December 2024',
        period: 'Dec 1 - Dec 31, 2024',
        apiCalls: { used: 87234, limit: 250000, percentage: 34.9 },
        customers: { used: 3124, limit: 25000, percentage: 12.5 },
        storage: { used: '5.4 GB', limit: '50 GB', percentage: 10.8 },
        bandwidth: { used: '58 GB', limit: '500 GB', percentage: 11.6 },
        cost: 299.0,
        overages: 0,
      },
      {
        month: 'November 2024',
        period: 'Nov 1 - Nov 30, 2024',
        apiCalls: { used: 76892, limit: 250000, percentage: 30.8 },
        customers: { used: 2789, limit: 25000, percentage: 11.2 },
        storage: { used: '4.8 GB', limit: '50 GB', percentage: 9.6 },
        bandwidth: { used: '52 GB', limit: '500 GB', percentage: 10.4 },
        cost: 299.0,
        overages: 0,
      },
    ],
    invoices: [
      {
        id: 'INV-2025-10',
        date: '2025-10-01',
        amount: 299.0,
        status: 'Pending',
        pdfUrl: '/invoices/inv-2025-10.pdf',
        items: [
          {
            description: 'Pro Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 299.0,
            total: 299.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2025-09',
        date: '2025-09-01',
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2025-09.pdf',
        items: [
          {
            description: 'Pro Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 299.0,
            total: 299.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2025-08',
        date: '2025-08-01',
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2025-08.pdf',
        items: [
          {
            description: 'Pro Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 299.0,
            total: 299.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2025-07',
        date: '2025-07-01',
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2025-07.pdf',
        items: [
          {
            description: 'Pro Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 299.0,
            total: 299.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2025-06',
        date: '2025-06-01',
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2025-06.pdf',
        items: [
          {
            description: 'Pro Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 299.0,
            total: 299.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2025-05',
        date: '2025-05-01',
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2025-05.pdf',
        items: [
          {
            description: 'Pro Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 299.0,
            total: 299.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2025-04',
        date: '2025-04-01',
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2025-04.pdf',
        items: [
          {
            description: 'Pro Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 299.0,
            total: 299.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2025-03',
        date: '2025-03-01',
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2025-03.pdf',
        items: [
          {
            description: 'Pro Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 299.0,
            total: 299.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2025-02',
        date: '2025-02-01',
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2025-02.pdf',
        items: [
          {
            description: 'Pro Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 299.0,
            total: 299.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2025-01',
        date: '2025-01-01',
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2025-01.pdf',
        items: [
          {
            description: 'Pro Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 299.0,
            total: 299.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2024-12',
        date: '2024-12-01',
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2024-12.pdf',
        items: [
          {
            description: 'Pro Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 299.0,
            total: 299.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2024-11',
        date: '2024-11-01',
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2024-11.pdf',
        items: [
          {
            description: 'Pro Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 299.0,
            total: 299.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2024-10',
        date: '2024-10-01',
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2024-10.pdf',
        items: [
          {
            description: 'Pro Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 299.0,
            total: 299.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2024-09',
        date: '2024-09-01',
        amount: 99.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2024-09.pdf',
        items: [
          {
            description: 'Starter Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 99.0,
            total: 99.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
      {
        id: 'INV-2024-08',
        date: '2024-08-01',
        amount: 99.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2024-08.pdf',
        items: [
          {
            description: 'Starter Plan - Monthly Subscription',
            quantity: 1,
            unitPrice: 99.0,
            total: 99.0,
          },
        ],
        paymentMethod: '**** 4242',
      },
    ],
    paymentMethods: [
      {
        id: '1',
        type: 'card',
        last4: '4242',
        expiryDate: '12/2026',
        isDefault: true,
        addedAt: '2024-01-15',
      },
      {
        id: '2',
        type: 'bank',
        last4: '7890',
        bankName: 'Chase Bank',
        isDefault: false,
        addedAt: '2024-03-20',
      },
    ],
    alerts: [
      {
        id: '1',
        metric: 'API Calls',
        currentUsage: 105358,
        limit: 250000,
        percentage: 42.1,
        severity: 'Warning',
        timestamp: '2024-10-24 14:00',
      },
    ],
    nextBillingDate: '2024-11-01',
    billingCycle: 'Monthly',
  }
}

export const addPaymentMethod = async (paymentDetails: {
  type: 'card' | 'bank'
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  bankAccount?: string
  routingNumber?: string
}): Promise<PaymentMethod> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: Math.random().toString(36).substr(2, 9),
    type: paymentDetails.type,
    last4: paymentDetails.cardNumber?.slice(-4) || paymentDetails.bankAccount?.slice(-4) || '0000',
    expiryDate: paymentDetails.expiryDate,
    isDefault: false,
    addedAt: new Date().toISOString(),
  }
}

export const updatePlan = async (
  planTier: 'Free' | 'Starter' | 'Pro' | 'Enterprise',
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  console.log('Updating plan to:', planTier)
}
