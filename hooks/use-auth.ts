"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient, type AuthResponse } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface AuthState {
  user: AuthResponse["user"] | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export function useAuth() {
  const { toast } = useToast()
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const user = await apiClient.getProfile()
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : "Authentication failed",
        })
      }
    }

    initAuth()
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await apiClient.login(email, password)
        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })

        toast({
          title: "Welcome back!",
          description: `Logged in as ${response.user.name}`,
        })

        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Login failed"

        // Log detailed error information
        console.error("Login error details:", {
          message: errorMessage,
          error,
          stack: error instanceof Error ? error.stack : undefined,
        })

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }))

        // Only show toast for non-network errors
        if (
          !(
            error instanceof Error &&
            (error.message.includes("Network error") ||
              error.message.includes("Failed to fetch") ||
              error.message.includes("timed out"))
          )
        ) {
          toast({
            title: "Login failed",
            description: errorMessage,
            variant: "destructive",
          })
        }

        throw error
      }
    },
    [toast],
  )

  const register = useCallback(
    async (userData: { name: string; email: string; password: string }) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await apiClient.register(userData)
        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })

        toast({
          title: "Account created!",
          description: `Welcome ${response.user.name}!`,
        })

        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Registration failed"

        // Log detailed error information
        console.error("Registration error details:", {
          message: errorMessage,
          error,
          stack: error instanceof Error ? error.stack : undefined,
        })

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }))

        // Only show toast for non-network errors
        if (
          !(
            error instanceof Error &&
            (error.message.includes("Network error") ||
              error.message.includes("Failed to fetch") ||
              error.message.includes("timed out"))
          )
        ) {
          toast({
            title: "Registration failed",
            description: errorMessage,
            variant: "destructive",
          })
        }

        throw error
      }
    },
    [toast],
  )

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      await apiClient.logout()
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })

      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      console.error("Logout error:", error)
      // Still clear the state even if logout request fails
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  }, [toast])

  const updateProfile = useCallback(
    async (userData: Partial<{ name: string; email: string }>) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const updatedUser = await apiClient.updateProfile(userData)
        setState((prev) => ({
          ...prev,
          user: updatedUser,
          isLoading: false,
        }))

        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated",
        })

        return updatedUser
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Profile update failed"
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }))

        toast({
          title: "Update failed",
          description: errorMessage,
          variant: "destructive",
        })

        throw error
      }
    },
    [toast],
  )

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  }
}
