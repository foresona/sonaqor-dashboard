// Risk & Compliance data source

export interface Anomaly {
  id: string
  customerId: string
  customerName: string
  type:
    | 'Unusual Transaction Pattern'
    | 'High-Risk Merchant'
    | 'Velocity Spike'
    | 'Geographic Anomaly'
    | 'Amount Outlier'
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  confidence: number
  timestamp: string
  details: string
  transactionAmount?: number
}

export interface NetworkNode {
  id: string
  customerId: string
  name: string
  riskScore: number
  connections: string[]
  transactionCount: number
  totalAmount: number
}

export interface SARDraft {
  id: string
  customerId: string
  customerName: string
  reasons: string[]
  narrative: string
  status: 'Draft' | 'Under Review' | 'Filed' | 'Rejected'
  createdAt: string
  filedAt?: string
}

export interface PEPCheck {
  customerId: string
  name: string
  matchType: 'Exact' | 'Partial' | 'Fuzzy'
  confidence: number
  source: string
  position?: string
  country?: string
  checkDate: string
}

export interface ComplianceStats {
  totalAnomalies: number
  criticalAnomalies: number
  openSARs: number
  pepMatches: number
  averageRiskScore: number
}

export interface ComplianceData {
  anomalies: Anomaly[]
  network: NetworkNode[]
  sarDrafts: SARDraft[]
  pepChecks: PEPCheck[]
  stats: ComplianceStats
}

// Mock data - replace with API calls
export const getComplianceData = async (filters?: {
  severity?: string
  type?: string
  dateRange?: string
}): Promise<ComplianceData> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const anomalies: Anomaly[] = [
    {
      id: '1',
      customerId: '3',
      customerName: 'Michael Chen',
      type: 'Unusual Transaction Pattern',
      severity: 'High',
      confidence: 0.89,
      timestamp: '2024-10-24 12:20',
      details: 'Multiple large transactions to new recipients in short timeframe',
      transactionAmount: 15000,
    },
    {
      id: '2',
      customerId: '8',
      customerName: 'Jennifer Taylor',
      type: 'Amount Outlier',
      severity: 'Critical',
      confidence: 0.94,
      timestamp: '2024-10-24 08:15',
      details: 'Single transaction 500% above historical average',
      transactionAmount: 50000,
    },
    {
      id: '3',
      customerId: '2',
      customerName: 'Sarah Johnson',
      type: 'Velocity Spike',
      severity: 'Medium',
      confidence: 0.76,
      timestamp: '2024-10-24 13:45',
      details: 'Transaction frequency increased 300% in 24 hours',
      transactionAmount: 8500,
    },
    {
      id: '4',
      customerId: '5',
      customerName: 'David Wilson',
      type: 'Geographic Anomaly',
      severity: 'Low',
      confidence: 0.68,
      timestamp: '2024-10-24 10:30',
      details: 'Transaction from unusual geographic location',
      transactionAmount: 1200,
    },
    {
      id: '5',
      customerId: '1',
      customerName: 'John Smith',
      type: 'High-Risk Merchant',
      severity: 'Medium',
      confidence: 0.82,
      timestamp: '2024-10-24 14:30',
      details: 'Transaction with merchant flagged for suspicious activity',
      transactionAmount: 3500,
    },
  ]

  const network: NetworkNode[] = [
    {
      id: '1',
      customerId: '3',
      name: 'Michael Chen',
      riskScore: 0.78,
      connections: ['2', '8', '11'],
      transactionCount: 15,
      totalAmount: 45000,
    },
    {
      id: '2',
      customerId: '8',
      name: 'Jennifer Taylor',
      riskScore: 0.85,
      connections: ['1', '3', '7'],
      transactionCount: 12,
      totalAmount: 68000,
    },
    {
      id: '3',
      customerId: '2',
      name: 'Sarah Johnson',
      riskScore: 0.45,
      connections: ['2', '5'],
      transactionCount: 8,
      totalAmount: 12000,
    },
  ]

  const sarDrafts: SARDraft[] = [
    {
      id: '1',
      customerId: '8',
      customerName: 'Jennifer Taylor',
      reasons: ['Unusual Transaction Pattern', 'Amount Outlier', 'Multiple High-Risk Transactions'],
      narrative:
        'Customer Jennifer Taylor (ID: CUST-008) has exhibited multiple suspicious transaction patterns including amounts significantly above historical averages, unusual velocity of transactions, and connections to other flagged accounts. Total suspicious amount: $68,000 over 7 days.',
      status: 'Under Review',
      createdAt: '2024-10-23',
    },
    {
      id: '2',
      customerId: '3',
      customerName: 'Michael Chen',
      reasons: ['Unusual Transaction Pattern', 'Network Connection to Flagged Accounts'],
      narrative:
        'Customer Michael Chen (ID: CUST-003) has demonstrated unusual transaction patterns with multiple large transfers to new recipients. Customer has direct connections to other accounts under investigation.',
      status: 'Draft',
      createdAt: '2024-10-24',
    },
  ]

  const pepChecks: PEPCheck[] = [
    {
      customerId: '8',
      name: 'Jennifer Taylor',
      matchType: 'Partial',
      confidence: 0.42,
      source: 'OFAC SDN List',
      checkDate: '2024-10-24',
    },
  ]

  return {
    anomalies,
    network,
    sarDrafts,
    pepChecks,
    stats: {
      totalAnomalies: anomalies.length,
      criticalAnomalies: anomalies.filter((a) => a.severity === 'Critical').length,
      openSARs: sarDrafts.filter((s) => s.status !== 'Filed').length,
      pepMatches: pepChecks.length,
      averageRiskScore: 0.62,
    },
  }
}

export const generateSARDraft = async (
  customerId: string,
  reasons: string[],
): Promise<SARDraft> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: Math.random().toString(36).substr(2, 9),
    customerId,
    customerName: `Customer ${customerId}`,
    reasons,
    narrative: `Auto-generated SAR draft for customer ${customerId} based on detected anomalies: ${reasons.join(
      ', ',
    )}. This requires manual review and completion.`,
    status: 'Draft',
    createdAt: new Date().toISOString(),
  }
}
