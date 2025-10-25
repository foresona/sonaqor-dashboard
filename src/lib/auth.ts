// Authentication service
// In production, replace with actual API calls

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'partner'
  organizationId: string
  organizationName: string
  avatar?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

// Mock user database - replace with actual API
const MOCK_USERS = [
  {
    email: 'admin@sonaqor.com',
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@sonaqor.com',
      name: 'Abraham Agiri',
      role: 'admin' as const,
      organizationId: 'org-1',
      organizationName: 'Sonaqor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  },
  {
    email: 'partner@example.com',
    password: 'partner123',
    user: {
      id: '2',
      email: 'partner@example.com',
      name: 'Partner User',
      role: 'partner' as const,
      organizationId: 'org-2',
      organizationName: 'Example Corp',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=partner',
    },
  },
  {
    email: 'user@example.com',
    password: 'user123',
    user: {
      id: '3',
      email: 'user@example.com',
      name: 'Basic User',
      role: 'user' as const,
      organizationId: 'org-3',
      organizationName: 'User Org',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    },
  },
]

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const mockUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (!mockUser) {
      throw new Error('Invalid email or password')
    }

    // Generate mock tokens
    const token = `mock_token_${Date.now()}_${mockUser.user.id}`
    const refreshToken = `mock_refresh_${Date.now()}_${mockUser.user.id}`

    return {
      user: mockUser.user,
      token,
      refreshToken,
    }
  },

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    // In production, call API to invalidate tokens
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock refresh - in production, validate refresh token with API
    const userId = refreshToken.split('_').pop()
    const mockUser = MOCK_USERS.find((u) => u.user.id === userId)

    if (!mockUser) {
      throw new Error('Invalid refresh token')
    }

    const token = `mock_token_${Date.now()}_${mockUser.user.id}`
    const newRefreshToken = `mock_refresh_${Date.now()}_${mockUser.user.id}`

    return {
      user: mockUser.user,
      token,
      refreshToken: newRefreshToken,
    }
  },

  async verifyToken(token: string): Promise<User | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Mock verification - in production, verify with API
    const userId = token.split('_').pop()
    const mockUser = MOCK_USERS.find((u) => u.user.id === userId)

    return mockUser?.user || null
  },

  async getCurrentUser(): Promise<User | null> {
    // Get from localStorage in browser
    if (typeof window === 'undefined') return null

    const token = localStorage.getItem('auth_token')
    if (!token) return null

    return this.verifyToken(token)
  },
}
