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

export async function createInvite(data: CreateInviteRequest): Promise<InviteResponse> {
  // In a real app, this would make an API call
  // For now, we'll simulate the API response

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

  try {
    // Simulate API call
    // const response = await fetch('/api/invites', {
    //   method: 'POST',
    //   body: formData
    // })

    // For demo purposes, return a mock response
    const mockResponse: InviteResponse = {
      host_id: "cbbe60a1-90dd-4df8-8fb4-1c1f4d902675",
      name: data.name,
      cover_image_media: data.cover_image_media ? URL.createObjectURL(data.cover_image_media) : null,
      start_datetime: data.start_datetime,
      nights: data.nights,
      location_name: data.location_name,
      location_lat: data.location_lat,
      location_lng: data.location_lng,
      place_id: data.place_id,
      category_id: data.category_id,
      description: data.description,
      soft_delete: false,
      countries: { countries: null },
      tags: data.tags,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      host: {
        name: "Demo User",
        email: "demo@example.com",
        id: "cbbe60a1-90dd-4df8-8fb4-1c1f4d902675",
        often_user_id: 1000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      config: {
        invite_id: generateId(),
        ...data.config,
      },
      category: {
        name: "Travel",
        id: data.category_id,
      },
      custom_links: data.custom_links,
      draft: null,
    }

    return mockResponse
  } catch (error) {
    console.error("Error creating invite:", error)
    throw new Error("Failed to create invite")
  }
}

export async function getInvite(id: string): Promise<InviteResponse> {
  try {
    // In a real app, this would fetch from API
    // const response = await fetch(`/api/invites/${id}`)
    // return response.json()

    // For demo, get from localStorage
    const stored = localStorage.getItem(`invite_${id}`)
    if (stored) {
      return JSON.parse(stored)
    }
    throw new Error("Invite not found")
  } catch (error) {
    console.error("Error fetching invite:", error)
    throw new Error("Failed to fetch invite")
  }
}

function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
