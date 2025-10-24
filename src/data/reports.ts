// Reports & Exports data source

export interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'Usage' | 'Personas' | 'Anomalies' | 'Compliance' | 'Financial' | 'Custom'
  parameters: {
    name: string
    type: 'date' | 'select' | 'multiselect' | 'number'
    options?: string[]
    required: boolean
  }[]
  estimatedTime: string
}

export interface Report {
  id: string
  templateId: string
  name: string
  status: 'Generating' | 'Completed' | 'Failed'
  createdAt: string
  completedAt?: string
  downloadUrl?: string
  format: 'CSV' | 'Excel' | 'PDF' | 'JSON'
  size?: string
}

export interface ReportSchedule {
  id: string
  templateId: string
  templateName: string
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Custom'
  cronExpression?: string
  recipients: string[]
  format: 'CSV' | 'Excel' | 'PDF' | 'JSON'
  nextRun: string
  lastRun?: string
  active: boolean
}

export interface ReportsData {
  templates: ReportTemplate[]
  reports: Report[]
  schedules: ReportSchedule[]
}

// Mock data - replace with API calls
export const getReportsData = async (): Promise<ReportsData> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    templates: [
      {
        id: '1',
        name: 'API Usage Report',
        description: 'Comprehensive API usage statistics and performance metrics',
        type: 'Usage',
        parameters: [
          {
            name: 'Date Range',
            type: 'date',
            required: true,
          },
          {
            name: 'Group By',
            type: 'select',
            options: ['App', 'Endpoint', 'User', 'Hour', 'Day'],
            required: true,
          },
        ],
        estimatedTime: '2-3 minutes',
      },
      {
        id: '2',
        name: 'Persona Distribution Report',
        description: 'Customer behavioral persona analysis and trends',
        type: 'Personas',
        parameters: [
          {
            name: 'Date Range',
            type: 'date',
            required: true,
          },
          {
            name: 'Personas',
            type: 'multiselect',
            options: [
              'Steady Saver',
              'Impulsive Spender',
              'Goal-Oriented',
              'Risk Taker',
              'Cautious Spender',
            ],
            required: false,
          },
        ],
        estimatedTime: '5-7 minutes',
      },
      {
        id: '3',
        name: 'Anomaly Detection Report',
        description: 'Detected anomalies, risk scores, and suspicious activities',
        type: 'Anomalies',
        parameters: [
          {
            name: 'Date Range',
            type: 'date',
            required: true,
          },
          {
            name: 'Severity',
            type: 'multiselect',
            options: ['Low', 'Medium', 'High', 'Critical'],
            required: false,
          },
        ],
        estimatedTime: '3-5 minutes',
      },
      {
        id: '4',
        name: 'Compliance Summary',
        description: 'SAR drafts, PEP checks, and regulatory compliance metrics',
        type: 'Compliance',
        parameters: [
          {
            name: 'Date Range',
            type: 'date',
            required: true,
          },
        ],
        estimatedTime: '4-6 minutes',
      },
      {
        id: '5',
        name: 'Customer Financial Profile',
        description: 'Individual or bulk customer financial behavior profiles',
        type: 'Financial',
        parameters: [
          {
            name: 'Customer IDs',
            type: 'multiselect',
            required: true,
          },
          {
            name: 'Include Transactions',
            type: 'select',
            options: ['Yes', 'No'],
            required: true,
          },
        ],
        estimatedTime: '1-2 minutes per customer',
      },
    ],
    reports: [
      {
        id: '1',
        templateId: '1',
        name: 'API Usage - October 2024',
        status: 'Completed',
        createdAt: '2024-10-24 10:30',
        completedAt: '2024-10-24 10:33',
        downloadUrl: '/reports/api-usage-oct-2024.pdf',
        format: 'PDF',
        size: '2.4 MB',
      },
      {
        id: '2',
        templateId: '2',
        name: 'Persona Distribution - Q3 2024',
        status: 'Completed',
        createdAt: '2024-10-23 14:20',
        completedAt: '2024-10-23 14:26',
        downloadUrl: '/reports/persona-dist-q3-2024.xlsx',
        format: 'Excel',
        size: '1.8 MB',
      },
      {
        id: '3',
        templateId: '3',
        name: 'Anomaly Detection - Last 7 Days',
        status: 'Generating',
        createdAt: '2024-10-24 14:45',
        format: 'CSV',
      },
      {
        id: '4',
        templateId: '4',
        name: 'Compliance Summary - October 2024',
        status: 'Completed',
        createdAt: '2024-10-22 09:15',
        completedAt: '2024-10-22 09:20',
        downloadUrl: '/reports/compliance-oct-2024.pdf',
        format: 'PDF',
        size: '3.1 MB',
      },
    ],
    schedules: [
      {
        id: '1',
        templateId: '1',
        templateName: 'API Usage Report',
        frequency: 'Weekly',
        recipients: ['abraham@foresona.ai', 'team@foresona.ai'],
        format: 'PDF',
        nextRun: '2024-10-28 09:00',
        lastRun: '2024-10-21 09:00',
        active: true,
      },
      {
        id: '2',
        templateId: '4',
        templateName: 'Compliance Summary',
        frequency: 'Monthly',
        recipients: ['compliance@foresona.ai'],
        format: 'Excel',
        nextRun: '2024-11-01 08:00',
        lastRun: '2024-10-01 08:00',
        active: true,
      },
      {
        id: '3',
        templateId: '3',
        templateName: 'Anomaly Detection Report',
        frequency: 'Daily',
        recipients: ['security@foresona.ai', 'abraham@foresona.ai'],
        format: 'CSV',
        nextRun: '2024-10-25 00:00',
        lastRun: '2024-10-24 00:00',
        active: true,
      },
    ],
  }
}

export const generateReport = async (
  templateId: string,
  params: Record<string, any>,
): Promise<Report> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: Math.random().toString(36).substr(2, 9),
    templateId,
    name: `Report - ${new Date().toLocaleString()}`,
    status: 'Generating',
    createdAt: new Date().toISOString(),
    format: params.format || 'PDF',
  }
}

export const scheduleReport = async (
  templateId: string,
  schedule: Omit<ReportSchedule, 'id' | 'templateName' | 'nextRun' | 'lastRun'>,
): Promise<ReportSchedule> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    ...schedule,
    id: Math.random().toString(36).substr(2, 9),
    templateId,
    templateName: 'Custom Report',
    nextRun: new Date(Date.now() + 86400000).toISOString(),
  }
}
