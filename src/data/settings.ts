// Settings page data source

export interface UserProfile {
  name: string
  email: string
  organization: string
  avatar?: string
}

export interface NotificationSettings {
  emailNotifications: boolean
  rateLimitAlerts: boolean
  errorNotifications: boolean
  usageReports: boolean
  securityAlerts: boolean
  webhookFailures?: boolean
  apiLimitWarnings?: boolean
  weeklyReports?: boolean
}

export interface APISettings {
  rateLimit: number
  timezone: string
  dataRetention: number
  allowedOrigins?: string[]
  ipWhitelist?: string[]
  enableCORS?: boolean
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
  security?: {
    twoFactorEnabled: boolean
    lastPasswordChange?: string
    sessionTimeout?: number
  }
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
      rateLimitAlerts: true,
      errorNotifications: true,
      usageReports: false,
      securityAlerts: true,
      webhookFailures: true,
      apiLimitWarnings: true,
      weeklyReports: false,
    },
    apiSettings: {
      rateLimit: 1000,
      timezone: 'America/New_York',
      dataRetention: 90,
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
    security: {
      twoFactorEnabled: false,
      lastPasswordChange: '2025-09-15',
      sessionTimeout: 3600,
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

// Security operations
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  // Replace with actual API call
  const success = currentPassword.length > 0 && newPassword.length >= 8
  console.log('Changing password')
  return {
    success,
    message: success ? 'Password changed successfully' : 'Invalid password format',
  }
}

export const enable2FA = async (): Promise<{
  success: boolean
  secret: string
  qrCode: string
}> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // Replace with actual API call
  console.log('Enabling 2FA')
  return {
    success: true,
    secret: 'JBSWY3DPEHPK3PXP',
    qrCode: 'data:image/png;base64,...', // Would contain actual QR code
  }
}

export const disable2FA = async (
  verificationCode: string,
): Promise<{ success: boolean; message: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  // Replace with actual API call
  console.log('Disabling 2FA with code:', verificationCode)
  return {
    success: verificationCode.length === 6,
    message:
      verificationCode.length === 6 ? '2FA disabled successfully' : 'Invalid verification code',
  }
}

export const deleteAccount = async (
  password: string,
): Promise<{ success: boolean; message: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // Replace with actual API call
  console.log('Deleting account')
  return {
    success: password.length > 0,
    message: password.length > 0 ? 'Account deletion initiated' : 'Invalid password',
  }
}
