import { NextResponse } from "next/server"

// This is a mock API route that can be used during development
// It simulates creating an invite in a database
export async function POST(request: Request) {
  try {
    console.log("🔥 Mock API: POST /api/mock/invites called")

    // Log request details
    console.log("📥 Request headers:", Object.fromEntries(request.headers.entries()))

    // In a real implementation, you would parse the form data
    // and save it to your database
    const formData = await request.formData()
    console.log(
      "📦 FormData entries:",
      Array.from(formData.entries()).map(([key, value]) => [
        key,
        typeof value === "string" ? value.substring(0, 100) + "..." : `File: ${value.constructor.name}`,
      ]),
    )

    const dataJson = formData.get("data") as string
    if (!dataJson) {
      console.error("❌ No data field in FormData")
      return NextResponse.json({ error: "Missing data field" }, { status: 400 })
    }

    const data = JSON.parse(dataJson)
    console.log("✅ Parsed data:", {
      name: data.name,
      location: data.location_name,
      nights: data.nights,
      hasConfig: !!data.config,
    })

    // Generate a random ID for the invite
    const id = crypto.randomUUID()
    console.log("🆔 Generated ID:", id)

    // Create a response that matches the expected format
    const response = {
      host_id: "cbbe60a1-90dd-4df8-8fb4-1c1f4d902675",
      name: data.name,
      cover_image_media: "/placeholder.svg?height=800&width=600", // In a real app, this would be the uploaded file URL
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
      tags: data.tags || [],
      id: id,
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
        invite_id: id,
        ...data.config,
      },
      category: {
        name: "Travel",
        id: data.category_id,
      },
      custom_links: data.custom_links || [],
      draft: null,
    }

    console.log("🚀 Sending response:", {
      id: response.id,
      name: response.name,
      status: "success",
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("❌ Mock API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create invite",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Add GET method for testing
export async function GET() {
  console.log("🔥 Mock API: GET /api/mock/invites called")
  return NextResponse.json({
    message: "Mock API is working",
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: "/api/mock/invites - Create invite",
      GET: "/api/mock/invites/[id] - Get invite by ID",
    },
  })
}
