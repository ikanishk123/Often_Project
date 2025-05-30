import { getApiUrl } from "@/lib/config"
import { localStorageHelper } from "@/lib/local-storage"

// Types for API requests and responses
export interface CreateInviteRequest {
  name: string
  cover_image_media: File | null
  nights: number
  start_datetime: string
  location_name: string
  location_lat: string
  location_lng: string
  place_id: string
  category_id: string
  description: string
  soft_delete: boolean
  countries: {
    start: string
    end: string
  }
  tags: string[]
  config: {
    capacity: number
    enable_waitlist: boolean
    guest_approval: boolean
    is_public: boolean
    password_key: string
    status: string
    is_ticker: boolean
    ticker_text: string
    place_name: string
    rules: string[]
  }
  custom_links: Array<{
    emoji: string
    label: string
    url: string
  }>
}

export interface InviteResponse {
  host_id: string
  name: string
  cover_image_media: string | null
  start_datetime: string
  nights: number
  location_name: string
  location_lat: string
  location_lng: string
  place_id: string
  category_id: string
  description: string
  soft_delete: boolean
  countries: {
    countries: any
  }
  tags: string[]
  id: string
  created_at: string
  updated_at: string
  host: {
    name: string
    email: string
    id: string
    often_user_id: number
    created_at: string
    updated_at: string
  }
  config: {
    invite_id: string
    capacity: number
    enable_waitlist: boolean
    guest_approval: boolean
    is_public: boolean
    password_key: string
    status: string
    is_ticker: boolean
    ticker_text: string
    place_name: string
    rules: string[]
  }
  category: {
    name: string
    id: string
  }
  custom_links: Array<{
    emoji: string
    label: string
    url: string
  }>
  draft: any
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    often_user_id: number
    created_at: string
    updated_at: string
  }
}

export interface ApiError {
  error: string
  message: string
  details?: any
}

// API client class - now primarily uses localStorage
class ApiClient {
  private token: string | null = null
  private baseUrl: string
  private useLocalStorage = true // Primary storage method

  constructor() {
    this.baseUrl = getApiUrl()
    // Try to load token from localStorage on initialization
    if (typeof window !== "undefined") {
      this.token = localStorageHelper.getItem("auth_token")
    }
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token
    localStorageHelper.setItem("auth_token", token)
  }

  // Get authentication token
  getToken(): string | null {
    return this.token
  }

  // Clear authentication token
  clearToken() {
    this.token = null
    localStorageHelper.removeItem("auth_token")
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token
  }

  // Create a new invite - now uses localStorage as primary storage
  async createInvite(data: CreateInviteRequest): Promise<InviteResponse> {
    console.log("🚀 Creating invite with localStorage as primary storage")

    try {
      // Generate a unique ID for the invite
      const id = crypto.randomUUID()

      // Handle file upload - convert to base64 for localStorage
      let coverImageData: string | null = null
      if (data.cover_image_media) {
        try {
          coverImageData = await this.fileToBase64(data.cover_image_media)
        } catch (error) {
          console.warn("Could not convert file to base64:", error)
          // Create object URL as fallback
          coverImageData = URL.createObjectURL(data.cover_image_media)
        }
      }

      // Create the invite response object
      const inviteResponse: InviteResponse = {
        host_id: this.getCurrentUserId(),
        name: data.name,
        cover_image_media: coverImageData,
        start_datetime: data.start_datetime,
        nights: data.nights,
        location_name: data.location_name,
        location_lat: data.location_lat,
        location_lng: data.location_lng,
        place_id: data.place_id,
        category_id: data.category_id,
        description: data.description,
        soft_delete: false,
        countries: { countries: data.countries },
        tags: data.tags,
        id: id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        host: this.getCurrentUser(),
        config: {
          invite_id: id,
          ...data.config,
        },
        category: {
          name: "Travel",
          id: data.category_id,
        },
        custom_links: data.custom_links,
        draft: null,
      }

      // Save to localStorage
      const savedId = localStorageHelper.saveInvite(inviteResponse)

      // Clear any saved draft since we've created the invite
      localStorageHelper.clearDraft()

      console.log("✅ Invite created and saved to localStorage:", savedId)
      return inviteResponse
    } catch (error) {
      console.error("❌ Error creating invite:", error)
      throw new Error("Failed to create invite: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  // Get an invite by ID - from localStorage
  async getInvite(id: string): Promise<InviteResponse> {
    console.log("🔍 Fetching invite from localStorage:", id)

    try {
      const invite = localStorageHelper.getInvite(id)
      if (invite) {
        console.log("✅ Invite found in localStorage")
        return invite
      } else {
        console.log("❌ Invite not found in localStorage")
        throw new Error("Invite not found")
      }
    } catch (error) {
      console.error("❌ Error fetching invite:", error)
      throw new Error("Failed to fetch invite: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  // Get all invites for the authenticated user
  async getInvites(
    page = 1,
    limit = 10,
  ): Promise<{ invites: InviteResponse[]; total: number; page: number; limit: number }> {
    console.log("📋 Fetching all invites from localStorage")

    try {
      const allInvites = localStorageHelper.getAllInvites()

      // Apply pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedInvites = allInvites.slice(startIndex, endIndex)

      return {
        invites: paginatedInvites,
        total: allInvites.length,
        page,
        limit,
      }
    } catch (error) {
      console.error("❌ Error fetching invites:", error)
      throw new Error("Failed to fetch invites: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  // Update an invite
  async updateInvite(id: string, data: Partial<CreateInviteRequest>): Promise<InviteResponse> {
    console.log("✏️ Updating invite in localStorage:", id)

    try {
      const existingInvite = localStorageHelper.getInvite(id)
      if (!existingInvite) {
        throw new Error("Invite not found")
      }

      // Handle file upload if provided
      let coverImageData = existingInvite.cover_image_media
      if (data.cover_image_media) {
        try {
          coverImageData = await this.fileToBase64(data.cover_image_media)
        } catch (error) {
          console.warn("Could not convert file to base64:", error)
          coverImageData = URL.createObjectURL(data.cover_image_media)
        }
      }

      // Update the invite
      const updatedInvite: InviteResponse = {
        ...existingInvite,
        ...data,
        cover_image_media: coverImageData,
        updated_at: new Date().toISOString(),
        config: {
          ...existingInvite.config,
          ...data.config,
        },
      }

      // Save updated invite
      localStorageHelper.saveInvite(updatedInvite)

      console.log("✅ Invite updated in localStorage")
      return updatedInvite
    } catch (error) {
      console.error("❌ Error updating invite:", error)
      throw new Error("Failed to update invite: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  // Delete an invite
  async deleteInvite(id: string): Promise<void> {
    console.log("🗑️ Deleting invite from localStorage:", id)

    try {
      const success = localStorageHelper.deleteInvite(id)
      if (!success) {
        throw new Error("Failed to delete invite")
      }
      console.log("✅ Invite deleted from localStorage")
    } catch (error) {
      console.error("❌ Error deleting invite:", error)
      throw new Error("Failed to delete invite: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  // Publish an invite (change status from DRAFT to PUBLISHED)
  async publishInvite(id: string): Promise<InviteResponse> {
    console.log("📢 Publishing invite:", id)

    try {
      const invite = localStorageHelper.getInvite(id)
      if (!invite) {
        throw new Error("Invite not found")
      }

      // Update status to published
      const publishedInvite: InviteResponse = {
        ...invite,
        config: {
          ...invite.config,
          status: "PUBLISHED",
        },
        updated_at: new Date().toISOString(),
      }

      // Save updated invite
      localStorageHelper.saveInvite(publishedInvite)

      console.log("✅ Invite published")
      return publishedInvite
    } catch (error) {
      console.error("❌ Error publishing invite:", error)
      throw new Error("Failed to publish invite: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  // Mock authentication methods for localStorage mode
  async login(email: string, password: string): Promise<AuthResponse> {
    console.log("🔐 Mock login for localStorage mode")

    // Simple validation
    if (!email || !password || password.length < 6) {
      throw new Error("Invalid email or password")
    }

    // Create mock user and token
    const token = `local_token_${Math.random().toString(36).substring(2, 15)}`
    const user = {
      id: crypto.randomUUID(),
      name: email
        .split("@")[0]
        .replace(/[^a-zA-Z0-9]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      email: email,
      often_user_id: Math.floor(Math.random() * 10000),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Save user data
    localStorageHelper.setItem("current_user", JSON.stringify(user))
    this.setToken(token)

    return { token, user }
  }

  async register(userData: { name: string; email: string; password: string }): Promise<AuthResponse> {
    console.log("📝 Mock registration for localStorage mode")

    // Simple validation
    if (!userData.name || !userData.email || !userData.password || userData.password.length < 6) {
      throw new Error("All fields are required and password must be at least 6 characters")
    }

    // Create mock user and token
    const token = `local_token_${Math.random().toString(36).substring(2, 15)}`
    const user = {
      id: crypto.randomUUID(),
      name: userData.name,
      email: userData.email,
      often_user_id: Math.floor(Math.random() * 10000),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Save user data
    localStorageHelper.setItem("current_user", JSON.stringify(user))
    this.setToken(token)

    return { token, user }
  }

  async logout(): Promise<void> {
    console.log("🚪 Logout")
    this.clearToken()
    localStorageHelper.removeItem("current_user")
  }

  async getProfile(): Promise<AuthResponse["user"]> {
    const userStr = localStorageHelper.getItem("current_user")
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    // Return default user if no stored user
    return this.getCurrentUser()
  }

  async updateProfile(userData: Partial<{ name: string; email: string }>): Promise<AuthResponse["user"]> {
    const currentUser = await this.getProfile()
    const updatedUser = {
      ...currentUser,
      ...userData,
      updated_at: new Date().toISOString(),
    }

    localStorageHelper.setItem("current_user", JSON.stringify(updatedUser))
    return updatedUser
  }

  // Helper methods
  private getCurrentUser(): AuthResponse["user"] {
    const userStr = localStorageHelper.getItem("current_user")
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    // Return default user
    return {
      id: "default-user-id",
      name: "Local User",
      email: "user@localhost.com",
      often_user_id: 1000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  private getCurrentUserId(): string {
    return this.getCurrentUser().id
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result)
        } else {
          reject(new Error("Failed to convert file to base64"))
        }
      }
      reader.onerror = () => reject(new Error("File reading failed"))
      reader.readAsDataURL(file)
    })
  }

  // Storage management
  getStorageInfo() {
    return localStorageHelper.getStorageInfo()
  }

  clearAllData() {
    return localStorageHelper.clear()
  }

  // Draft management
  saveDraft(formData: any): boolean {
    return localStorageHelper.saveDraft(formData)
  }

  getDraft(): any | null {
    return localStorageHelper.getDraft()
  }

  clearDraft(): boolean {
    return localStorageHelper.clearDraft()
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient()

// Export types for use in components
export type { CreateInviteRequest, InviteResponse, AuthResponse, ApiError }
