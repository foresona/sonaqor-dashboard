// Authentication store using Zustand

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, type User } from '@/lib/auth'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.login(email, password)

          // Store tokens in localStorage and cookies
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', response.token)
            localStorage.setItem('refresh_token', response.refreshToken)

            // Set cookie for middleware
            document.cookie = `auth_token=${response.token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
          }

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
            isAuthenticated: false,
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.logout()

          // Clear tokens from localStorage and cookies
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('refresh_token')

            // Clear cookie
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
          }

          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      checkAuth: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        if (!token) {
          set({ isAuthenticated: false, user: null })
          return
        }

        try {
          const user = await authService.verifyToken(token)
          if (user) {
            set({
              user,
              token,
              isAuthenticated: true,
            })
          } else {
            // Token invalid, clear auth
            get().logout()
          }
        } catch (error) {
          get().logout()
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'sonaqor-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
