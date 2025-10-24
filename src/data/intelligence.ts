// Customer Intelligence data source

export interface PersonaDistribution {
  type: string
  count: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
  trendValue: number
}

export interface CravingProfile {
  type: string
  percentage: number
  confidence: number
  description: string
}

export interface DriftAlert {
  customerId: string
  customerName: string
  previousPersona: string
  currentPersona: string
  driftScore: number
  timestamp: string
  severity: 'Low' | 'Medium' | 'High'
}

export interface DemographicData {
  ageGroup: string
  gender: string
  region: string
  income: string
  personaType: string
  count: number
}

export interface ContextualPersona {
  context: string
  persona: string
  frequency: number
  avgConfidence: number
}

export interface IntelligenceData {
  personas: PersonaDistribution[]
  cravings: CravingProfile[]
  driftAlerts: DriftAlert[]
  demographics: DemographicData[]
  contextualPersonas: ContextualPersona[]
  totalCustomers: number
}

// Mock data - replace with API calls
export const getIntelligenceData = async (
  timeRange: '24h' | '7d' | '30d' | '90d' = '7d',
  filters?: {
    persona?: string
    riskLevel?: string
  },
): Promise<IntelligenceData> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    personas: [
      {
        type: 'Steady Saver',
        count: 2456,
        percentage: 28.5,
        trend: 'up',
        trendValue: 5.2,
      },
      {
        type: 'Impulsive Spender',
        count: 1823,
        percentage: 21.2,
        trend: 'down',
        trendValue: -2.1,
      },
      {
        type: 'Goal-Oriented',
        count: 1654,
        percentage: 19.2,
        trend: 'up',
        trendValue: 3.7,
      },
      {
        type: 'Cautious Spender',
        count: 1234,
        percentage: 14.3,
        trend: 'stable',
        trendValue: 0.3,
      },
      {
        type: 'Risk Taker',
        count: 876,
        percentage: 10.2,
        trend: 'up',
        trendValue: 1.8,
      },
      {
        type: 'Minimalist',
        count: 567,
        percentage: 6.6,
        trend: 'stable',
        trendValue: -0.5,
      },
    ],
    cravings: [
      {
        type: 'Security',
        percentage: 35.2,
        confidence: 0.89,
        description: 'Need for financial stability and safety',
      },
      {
        type: 'Growth',
        percentage: 24.8,
        confidence: 0.85,
        description: 'Desire to increase wealth and assets',
      },
      {
        type: 'Freedom',
        percentage: 18.5,
        confidence: 0.82,
        description: 'Preference for financial independence',
      },
      {
        type: 'Status',
        percentage: 12.3,
        confidence: 0.78,
        description: 'Motivation for social recognition through spending',
      },
      {
        type: 'Control',
        percentage: 9.2,
        confidence: 0.91,
        description: 'Need to manage and track every expense',
      },
    ],
    driftAlerts: [
      {
        customerId: '3',
        customerName: 'Michael Chen',
        previousPersona: 'Steady Saver',
        currentPersona: 'Risk Taker',
        driftScore: 0.73,
        timestamp: '2024-10-24 12:20',
        severity: 'High',
      },
      {
        customerId: '8',
        customerName: 'Jennifer Taylor',
        previousPersona: 'Cautious Spender',
        currentPersona: 'High Roller',
        driftScore: 0.68,
        timestamp: '2024-10-24 08:15',
        severity: 'High',
      },
      {
        customerId: '2',
        customerName: 'Sarah Johnson',
        previousPersona: 'Goal-Oriented',
        currentPersona: 'Impulsive Spender',
        driftScore: 0.45,
        timestamp: '2024-10-24 13:45',
        severity: 'Medium',
      },
      {
        customerId: '5',
        customerName: 'David Wilson',
        previousPersona: 'Steady Saver',
        currentPersona: 'Cautious Spender',
        driftScore: 0.28,
        timestamp: '2024-10-24 10:30',
        severity: 'Low',
      },
    ],
    demographics: [
      {
        ageGroup: '25-34',
        gender: 'Male',
        region: 'Urban',
        income: '$50k-$75k',
        personaType: 'Goal-Oriented',
        count: 423,
      },
      {
        ageGroup: '35-44',
        gender: 'Female',
        region: 'Suburban',
        income: '$75k-$100k',
        personaType: 'Steady Saver',
        count: 567,
      },
      {
        ageGroup: '18-24',
        gender: 'Female',
        region: 'Urban',
        income: '$25k-$50k',
        personaType: 'Impulsive Spender',
        count: 312,
      },
      {
        ageGroup: '45-54',
        gender: 'Male',
        region: 'Rural',
        income: '$100k+',
        personaType: 'Risk Taker',
        count: 234,
      },
    ],
    contextualPersonas: [
      {
        context: 'Weekend Shopping',
        persona: 'Impulsive Spender',
        frequency: 1245,
        avgConfidence: 0.84,
      },
      {
        context: 'Bill Payments',
        persona: 'Cautious Spender',
        frequency: 2134,
        avgConfidence: 0.92,
      },
      {
        context: 'Investment Transactions',
        persona: 'Goal-Oriented',
        frequency: 876,
        avgConfidence: 0.88,
      },
      {
        context: 'Emergency Expenses',
        persona: 'Risk Taker',
        frequency: 432,
        avgConfidence: 0.76,
      },
    ],
    totalCustomers: 8610,
  }
}
