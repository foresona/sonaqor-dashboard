// Dashboard page data source

export interface StatCardData {
  icon: string
  label: string
  value: string
  change: string
  gradientStart: string
  gradientEnd: string
}

export interface ChartDataPoint {
  x: number
  y: number
  value: string
  day?: string
}

export interface EndpointData {
  endpoint: string
  calls: string
  percentage: number
}

export interface ResponseTimeData {
  label: string
  value: string
  color: string
}

export interface GeographicData {
  country: string
  requests: string
  flag: string
  percentage: number
}

export interface ActivityData {
  action: string
  user: string
  time: string
  status: 'success' | 'warning' | 'info'
}

export interface DashboardData {
  stats: StatCardData[]
  chartData: {
    requests: string
    avgTime: string
    points: ChartDataPoint[]
  }
  topEndpoints: EndpointData[]
  successRate: {
    percentage: number
    success: number
    failed: number
  }
  responseTimes: ResponseTimeData[]
  geographic: GeographicData[]
  recentActivity: ActivityData[]
}

// Mock data - replace with API calls
export const getDashboardData = async (timeRange: string = '7d'): Promise<DashboardData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Adjust data based on time range
  const multiplier =
    {
      '24h': 0.05,
      '7d': 1,
      '30d': 4.3,
      '90d': 13,
    }[timeRange] || 1

  return {
    stats: [
      {
        icon: 'Users',
        label: 'Total Users',
        value: Math.round(1234 * multiplier).toLocaleString(),
        change: '+12%',
        gradientStart: '#3b82f6',
        gradientEnd: '#06b6d4',
      },
      {
        icon: 'TrendingUp',
        label: 'API Calls',
        value: `${(45.2 * multiplier).toFixed(1)}K`,
        change: '+23%',
        gradientStart: '#10b981',
        gradientEnd: '#059669',
      },
      {
        icon: 'Activity',
        label: 'Avg F_score',
        value: '72.5',
        change: '+5.2',
        gradientStart: '#a855f7',
        gradientEnd: '#ec4899',
      },
      {
        icon: 'AlertCircle',
        label: 'Anomalies',
        value: Math.round(12 * multiplier).toString(),
        change: '-8%',
        gradientStart: '#ef4444',
        gradientEnd: '#f97316',
      },
    ],
    chartData: {
      requests: `${Math.round(312 * multiplier)}K`,
      avgTime: '1.2s',
      points:
        timeRange === '24h'
          ? [
              { x: 50, y: 160, value: '2.1K', day: '00:00' },
              { x: 150, y: 180, value: '1.8K', day: '04:00' },
              { x: 250, y: 170, value: '1.5K', day: '08:00' },
              { x: 350, y: 120, value: '3.2K', day: '12:00' },
              { x: 450, y: 95, value: '4.1K', day: '16:00' },
              { x: 550, y: 85, value: '3.8K', day: '20:00' },
              { x: 650, y: 140, value: '2.5K', day: '24:00' },
            ]
          : timeRange === '30d'
          ? [
              { x: 50, y: 130, value: '180K', day: 'Week 1' },
              { x: 150, y: 90, value: '220K', day: 'Week 2' },
              { x: 250, y: 150, value: '165K', day: 'Week 3' },
              { x: 350, y: 50, value: '280K', day: 'Week 4' },
              { x: 450, y: 85, value: '225K', day: 'Week 5' },
              { x: 550, y: 140, value: '175K', day: '' },
              { x: 650, y: 110, value: '195K', day: '' },
            ]
          : timeRange === '90d'
          ? [
              { x: 50, y: 140, value: '520K', day: 'Month 1' },
              { x: 150, y: 100, value: '680K', day: 'Month 2' },
              { x: 250, y: 160, value: '450K', day: 'Month 3' },
              { x: 350, y: 60, value: '780K', day: '' },
              { x: 450, y: 95, value: '610K', day: '' },
              { x: 550, y: 45, value: '820K', day: '' },
              { x: 650, y: 80, value: '720K', day: '' },
            ]
          : [
              { x: 50, y: 140, value: '42K', day: 'Mon' },
              { x: 150, y: 100, value: '51K', day: 'Tue' },
              { x: 250, y: 160, value: '35K', day: 'Wed' },
              { x: 350, y: 60, value: '58K', day: 'Thu' },
              { x: 450, y: 95, value: '48K', day: 'Fri' },
              { x: 550, y: 45, value: '63K', day: 'Sat' },
              { x: 650, y: 80, value: '54K', day: 'Sun' },
            ],
    },
    topEndpoints: [
      {
        endpoint: '/forecast/generate',
        calls: `${(45.2 * multiplier).toFixed(1)}K`,
        percentage: 85,
      },
      { endpoint: '/persona/match', calls: `${(32.1 * multiplier).toFixed(1)}K`, percentage: 60 },
      {
        endpoint: '/fscores/calculate',
        calls: `${(21.5 * multiplier).toFixed(1)}K`,
        percentage: 40,
      },
      { endpoint: '/anomaly/detect', calls: `${(12.3 * multiplier).toFixed(1)}K`, percentage: 25 },
    ],
    successRate: {
      percentage: 99.2,
      success: Math.round(312456 * multiplier),
      failed: Math.round(2544 * multiplier),
    },
    responseTimes: [
      { label: 'p50', value: '245ms', color: '#10b981' },
      { label: 'p90', value: '892ms', color: '#3b82f6' },
      { label: 'p99', value: '1.8s', color: '#a855f7' },
    ],
    geographic: [
      {
        country: 'Nigeria',
        requests: `${Math.round(156 * multiplier)}K`,
        flag: '🇳🇬',
        percentage: 75,
      },
      { country: 'Kenya', requests: `${Math.round(89 * multiplier)}K`, flag: '🇰🇪', percentage: 43 },
      {
        country: 'South Africa',
        requests: `${Math.round(52 * multiplier)}K`,
        flag: '🇿🇦',
        percentage: 25,
      },
      { country: 'Ghana', requests: `${Math.round(18 * multiplier)}K`, flag: '🇬🇭', percentage: 8 },
    ],
    recentActivity: [
      {
        action: 'Persona forecast generated',
        user: 'user_1234',
        time: '2 minutes ago',
        status: 'success',
      },
      {
        action: 'Anomaly detected',
        user: 'user_5678',
        time: '15 minutes ago',
        status: 'warning',
      },
      {
        action: 'F_scores calculated',
        user: 'user_9012',
        time: '1 hour ago',
        status: 'success',
      },
      {
        action: 'New API key created',
        user: 'Your account',
        time: '3 hours ago',
        status: 'info',
      },
    ],
  }
}

// Helper to get icon component name
export const getIconName = (stat: StatCardData): string => {
  return stat.icon
}
