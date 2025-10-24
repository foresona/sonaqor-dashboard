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
