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
    invoices: [
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
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2024-09.pdf',
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
        id: 'INV-2024-08',
        date: '2024-08-01',
        amount: 299.0,
        status: 'Paid',
        pdfUrl: '/invoices/inv-2024-08.pdf',
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
