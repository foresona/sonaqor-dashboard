// Settings page data source

export interface UserProfile {
  name: string
  email: string
  organization: string
  avatar?: string
}

export interface NotificationSettings {
  emailNotifications: boolean
  webhookFailures: boolean
  apiLimitWarnings: boolean
  weeklyReports: boolean
  securityAlerts: boolean
}

export interface APISettings {
  rateLimit: number
  allowedOrigins: string[]
  ipWhitelist: string[]
  enableCORS: boolean
}

export interface BillingInfo {
  plan: 'Free' | 'Starter' | 'Pro' | 'Enterprise'
  billingCycle: 'Monthly' | 'Yearly'
  nextBillingDate: string
  paymentMethod: string
  currentUsage: {
    requests: number
    limit: number
  }
}

export interface SettingsData {
  profile: UserProfile
  notifications: NotificationSettings
  apiSettings: APISettings
  billing: BillingInfo
}

// Mock data - replace with API calls
export const getSettingsData = async (): Promise<SettingsData> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    profile: {
      name: 'Abraham Jr',
      email: 'abraham@example.com',
      organization: 'Foresona Inc',
    },
    notifications: {
      emailNotifications: true,
      webhookFailures: true,
      apiLimitWarnings: true,
      weeklyReports: false,
      securityAlerts: true,
    },
    apiSettings: {
      rateLimit: 1000,
      allowedOrigins: ['https://app.foresona.ai', 'https://staging.foresona.ai'],
      ipWhitelist: ['192.168.1.1', '10.0.0.0/24'],
      enableCORS: true,
    },
    billing: {
      plan: 'Pro',
      billingCycle: 'Monthly',
      nextBillingDate: '2024-12-01',
      paymentMethod: '**** **** **** 4242',
      currentUsage: {
        requests: 45234,
        limit: 100000,
      },
    },
  }
}

// Update settings functions
export const updateProfile = async (profile: UserProfile): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  // Replace with actual API call
  console.log('Updating profile:', profile)
}

export const updateNotifications = async (notifications: NotificationSettings): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  // Replace with actual API call
  console.log('Updating notifications:', notifications)
}

export const updateAPISettings = async (settings: APISettings): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  // Replace with actual API call
  console.log('Updating API settings:', settings)
}
