import { NextResponse } from "next/server"

// This is a mock API route that can be used during development
// It simulates fetching an invite by ID from a database
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  // In a real app, you would fetch this from your database
  const mockInvite = {
    host_id: "cbbe60a1-90dd-4df8-8fb4-1c1f4d902675",
    name: "Weekend Mountain Retreat",
    cover_image_media: "/placeholder.svg?height=800&width=600",
    start_datetime: "2025-09-15T16:00:00Z",
    nights: 3,
    location_name: "Big Bear Lake",
    location_lat: "34.2439",
    location_lng: "-116.9114",
    place_id: "ChIJK-3PGidLx4ARh3QjD1zV8Wk",
    category_id: "1a80a229-1ad6-405c-accc-28e38e1f2ecc",
    description: "Join us for a relaxing weekend in the mountains with hiking and stargazing!",
    soft_delete: false,
    countries: { countries: null },
    tags: [],
    id: id,
    created_at: "2025-05-21T12:50:05.783341Z",
    updated_at: "2025-05-21T12:50:05.783341Z",
    host: {
      name: "Melissa Rivera",
      email: "user1@example.com",
      id: "cbbe60a1-90dd-4df8-8fb4-1c1f4d902675",
      often_user_id: 1000,
      created_at: "2025-05-21T12:40:21.704500Z",
      updated_at: "2025-05-21T12:40:21.704500Z",
    },
    config: {
      invite_id: id,
      capacity: 12,
      enable_waitlist: true,
      guest_approval: true,
      is_public: false,
      password_key: "mountain2025",
      status: "DRAFT",
      is_ticker: true,
      ticker_text: "🏔 Mountain Retreat • Sep 15-18, 2025",
      place_name: "Bear Mountain Resort",
      rules: ["No pets allowed", "Bring your own hiking gear", "Quiet hours after 11pm"],
    },
    category: {
      name: "Social",
      id: "1a80a229-1ad6-405c-accc-28e38e1f2ecc",
    },
    custom_links: [
      {
        emoji: "🏡",
        label: "Cabin Details",
        url: "https://cabins.example.com/details",
      },
      {
        emoji: "🥾",
        label: "Hiking Trails",
        url: "https://trails.example.com/bigbear",
      },
      {
        emoji: "🧳",
        label: "Packing List",
        url: "https://docs.example.com/packing",
      },
    ],
    draft: null,
  }

  return NextResponse.json(mockInvite)
}
