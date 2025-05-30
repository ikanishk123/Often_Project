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

// API base URL - replace with your actual API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.travel-invite.example.com"

// API client class
class ApiClient {
  private token: string | null = null

  // Set authentication token
  setToken(token: string) {
    this.token = token
  }

  // Get authentication token
  getToken(): string | null {
    return this.token
  }

  // Clear authentication token
  clearToken() {
    this.token = null
  }

  // Get headers for API requests
  private getHeaders(includeContentType = true): HeadersInit {
    const headers: HeadersInit = {}

    if (includeContentType) {
      headers["Content-Type"] = "application/json"
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    return headers
  }

  // Handle API response
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API error: ${response.status}`)
    }

    return response.json() as Promise<T>
  }

  // Create a new invite
  async createInvite(data: CreateInviteRequest): Promise<InviteResponse> {
    const formData = new FormData()

    // Convert the data to match creating.json structure
    const createData = {
      name: data.name,
      cover_image_media: null, // Handle file upload separately
      nights: data.nights,
      start_datetime: data.start_datetime,
      location_name: data.location_name,
      location_lat: data.location_lat,
      location_lng: data.location_lng,
      place_id: data.place_id,
      category_id: data.category_id,
      description: data.description,
      soft_delete: false,
      countries: data.countries,
      tags: data.tags,
      config: data.config,
      custom_links: data.custom_links,
    }

    // Add JSON data
    formData.append("data", JSON.stringify(createData))

    // Add file if present
    if (data.cover_image_media) {
      formData.append("cover_image", data.cover_image_media)
    }

    const response = await fetch(`${API_BASE_URL}/invites`, {
      method: "POST",
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      body: formData,
    })

    return this.handleResponse<InviteResponse>(response)
  }

  // Get an invite by ID
  async getInvite(id: string): Promise<InviteResponse> {
    const response = await fetch(`${API_BASE_URL}/invites/${id}`, {
      method: "GET",
      headers: this.getHeaders(false),
    })

    return this.handleResponse<InviteResponse>(response)
  }

  // Get all invites
  async getInvites(): Promise<InviteResponse[]> {
    const response = await fetch(`${API_BASE_URL}/invites`, {
      method: "GET",
      headers: this.getHeaders(false),
    })

    return this.handleResponse<InviteResponse[]>(response)
  }

  // Update an invite
  async updateInvite(id: string, data: Partial<CreateInviteRequest>): Promise<InviteResponse> {
    const formData = new FormData()

    // Add JSON data
    formData.append("data", JSON.stringify(data))

    // Add file if present
    if (data.cover_image_media) {
      formData.append("cover_image", data.cover_image_media)
    }

    const response = await fetch(`${API_BASE_URL}/invites/${id}`, {
      method: "PUT",
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      body: formData,
    })

    return this.handleResponse<InviteResponse>(response)
  }

  // Delete an invite
  async deleteInvite(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/invites/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(false),
    })

    return this.handleResponse<void>(response)
  }

  // Login user
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    })

    const data = await this.handleResponse<{ token: string; user: any }>(response)
    this.setToken(data.token)
    return data
  }

  // Register user
  async register(userData: { name: string; email: string; password: string }): Promise<{ token: string; user: any }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    })

    const data = await this.handleResponse<{ token: string; user: any }>(response)
    this.setToken(data.token)
    return data
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient()
