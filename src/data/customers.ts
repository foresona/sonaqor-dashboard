// Customer Management data source

export interface Customer {
  id: string
  externalRef: string
  name: string
  email: string
  status: 'Active' | 'Inactive' | 'Flagged'
  lastAnalysis: string
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  persona: string
  confidence: number
}

export interface CustomerTransaction {
  id: string
  date: string
  amount: number
  category: string
  merchantName: string
  type: 'Debit' | 'Credit'
}

export interface CustomerAnalysis {
  personaType: string
  cravingProfile: {
    type: string
    percentage: number
  }[]
  confidence: number
  driftIndex: number
  analysisDate: string
}

export interface RiskFlag {
  id: string
  type: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  description: string
  timestamp: string
}

export interface CustomerDetail {
  customer: Customer
  transactions: CustomerTransaction[]
  analyses: CustomerAnalysis[]
  riskFlags: RiskFlag[]
}

export interface CustomersData {
  customers: Customer[]
  totalCount: number
}

// Mock data - replace with API calls
export const getCustomersData = async (filters?: {
  search?: string
  riskLevel?: string
  persona?: string
  status?: string
}): Promise<CustomersData> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const allCustomers: Customer[] = [
    {
      id: '1',
      externalRef: 'CUST-001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-24 14:30',
      riskLevel: 'Low',
      persona: 'Steady Saver',
      confidence: 0.92,
    },
    {
      id: '2',
      externalRef: 'CUST-002',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-24 13:45',
      riskLevel: 'Medium',
      persona: 'Impulsive Spender',
      confidence: 0.87,
    },
    {
      id: '3',
      externalRef: 'CUST-003',
      name: 'Michael Chen',
      email: 'm.chen@example.com',
      status: 'Flagged',
      lastAnalysis: '2024-10-24 12:20',
      riskLevel: 'High',
      persona: 'Risk Taker',
      confidence: 0.78,
    },
    {
      id: '4',
      externalRef: 'CUST-004',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-24 11:15',
      riskLevel: 'Low',
      persona: 'Goal-Oriented',
      confidence: 0.95,
    },
    {
      id: '5',
      externalRef: 'CUST-005',
      name: 'David Wilson',
      email: 'd.wilson@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-24 10:30',
      riskLevel: 'Medium',
      persona: 'Cautious Spender',
      confidence: 0.89,
    },
    {
      id: '6',
      externalRef: 'CUST-006',
      name: 'Lisa Martinez',
      email: 'lisa.m@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-24 09:45',
      riskLevel: 'Low',
      persona: 'Steady Saver',
      confidence: 0.91,
    },
    {
      id: '7',
      externalRef: 'CUST-007',
      name: 'James Brown',
      email: 'j.brown@example.com',
      status: 'Inactive',
      lastAnalysis: '2024-10-20 16:00',
      riskLevel: 'Low',
      persona: 'Minimalist',
      confidence: 0.83,
    },
    {
      id: '8',
      externalRef: 'CUST-008',
      name: 'Jennifer Taylor',
      email: 'jen.taylor@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-24 08:15',
      riskLevel: 'Critical',
      persona: 'High Roller',
      confidence: 0.76,
    },
    {
      id: '9',
      externalRef: 'CUST-009',
      name: 'Robert Garcia',
      email: 'r.garcia@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-24 07:30',
      riskLevel: 'Low',
      persona: 'Information Junkie',
      confidence: 0.88,
    },
    {
      id: '10',
      externalRef: 'CUST-010',
      name: 'Amanda White',
      email: 'amanda.w@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-24 06:45',
      riskLevel: 'Medium',
      persona: 'Tribe Connector',
      confidence: 0.84,
    },
    {
      id: '11',
      externalRef: 'CUST-011',
      name: 'Kevin Lee',
      email: 'kevin.lee@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-24 05:30',
      riskLevel: 'Low',
      persona: 'System Builder',
      confidence: 0.93,
    },
    {
      id: '12',
      externalRef: 'CUST-012',
      name: 'Michelle Rodriguez',
      email: 'm.rodriguez@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-24 04:15',
      riskLevel: 'Medium',
      persona: 'Entertained Scroller',
      confidence: 0.86,
    },
    {
      id: '13',
      externalRef: 'CUST-013',
      name: 'Daniel Kim',
      email: 'd.kim@example.com',
      status: 'Flagged',
      lastAnalysis: '2024-10-24 03:00',
      riskLevel: 'High',
      persona: 'Mood Regulator',
      confidence: 0.79,
    },
    {
      id: '14',
      externalRef: 'CUST-014',
      name: 'Jessica Anderson',
      email: 'j.anderson@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-24 02:30',
      riskLevel: 'Low',
      persona: 'Self-Improver',
      confidence: 0.91,
    },
    {
      id: '15',
      externalRef: 'CUST-015',
      name: 'Christopher Lopez',
      email: 'c.lopez@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-24 01:15',
      riskLevel: 'Low',
      persona: 'Steady Saver',
      confidence: 0.94,
    },
    {
      id: '16',
      externalRef: 'CUST-016',
      name: 'Ashley Martinez',
      email: 'ashley.m@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-23 23:00',
      riskLevel: 'Medium',
      persona: 'Goal-Oriented',
      confidence: 0.87,
    },
    {
      id: '17',
      externalRef: 'CUST-017',
      name: 'Matthew Thomas',
      email: 'm.thomas@example.com',
      status: 'Inactive',
      lastAnalysis: '2024-10-22 18:00',
      riskLevel: 'Low',
      persona: 'Minimalist',
      confidence: 0.82,
    },
    {
      id: '18',
      externalRef: 'CUST-018',
      name: 'Stephanie Harris',
      email: 's.harris@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-23 22:00',
      riskLevel: 'Medium',
      persona: 'Impulsive Spender',
      confidence: 0.85,
    },
    {
      id: '19',
      externalRef: 'CUST-019',
      name: 'Joshua Clark',
      email: 'j.clark@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-23 21:00',
      riskLevel: 'Low',
      persona: 'Information Junkie',
      confidence: 0.90,
    },
    {
      id: '20',
      externalRef: 'CUST-020',
      name: 'Nicole Walker',
      email: 'n.walker@example.com',
      status: 'Active',
      lastAnalysis: '2024-10-23 20:00',
      riskLevel: 'Critical',
      persona: 'Risk Taker',
      confidence: 0.75,
    },
  ]

  // Filter customers
  let filtered = allCustomers
  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.externalRef.toLowerCase().includes(search),
    )
  }
  if (filters?.riskLevel) {
    filtered = filtered.filter((c) => c.riskLevel === filters.riskLevel)
  }
  if (filters?.persona) {
    filtered = filtered.filter((c) => c.persona === filters.persona)
  }
  if (filters?.status) {
    filtered = filtered.filter((c) => c.status === filters.status)
  }

  return {
    customers: filtered,
    totalCount: filtered.length,
  }
}

export const getCustomerDetail = async (customerId: string): Promise<CustomerDetail | null> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const data = await getCustomersData()
  const customer = data.customers.find((c) => c.id === customerId)
  if (!customer) return null

  return {
    customer,
    transactions: [
      {
        id: '1',
        date: '2024-10-24',
        amount: 125.5,
        category: 'Groceries',
        merchantName: 'Whole Foods',
        type: 'Debit',
      },
      {
        id: '2',
        date: '2024-10-23',
        amount: 2500.0,
        category: 'Salary',
        merchantName: 'Employer Inc',
        type: 'Credit',
      },
      {
        id: '3',
        date: '2024-10-22',
        amount: 45.99,
        category: 'Entertainment',
        merchantName: 'Netflix',
        type: 'Debit',
      },
    ],
    analyses: [
      {
        personaType: customer.persona,
        cravingProfile: [
          { type: 'Security', percentage: 45 },
          { type: 'Growth', percentage: 30 },
          { type: 'Status', percentage: 15 },
          { type: 'Freedom', percentage: 10 },
        ],
        confidence: customer.confidence,
        driftIndex: 0.12,
        analysisDate: customer.lastAnalysis,
      },
    ],
    riskFlags:
      customer.riskLevel === 'High' || customer.riskLevel === 'Critical'
        ? [
            {
              id: '1',
              type: 'Unusual Transaction Pattern',
              severity: customer.riskLevel,
              description: 'Multiple large transactions detected outside normal behavior',
              timestamp: '2024-10-24 12:00',
            },
          ]
        : [],
  }
}
