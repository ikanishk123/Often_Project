import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const data = formData.get("data") as string
    const coverImage = formData.get("cover_image") as File | null

    if (!data) {
      return NextResponse.json({ error: "Missing invite data" }, { status: 400 })
    }

    const inviteData = JSON.parse(data)

    // Here you would:
    // 1. Validate the data against creating.json schema
    // 2. Upload the cover image to your storage service
    // 3. Save the invite to your database
    // 4. Return the response matching response.json schema

    // For demo purposes, return a mock response
    const response = {
      host_id: "cbbe60a1-90dd-4df8-8fb4-1c1f4d902675",
      ...inviteData,
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
        ...inviteData.config,
      },
      category: {
        name: "Travel",
        id: inviteData.category_id,
      },
      countries: { countries: null },
      draft: null,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error creating invite:", error)
    return NextResponse.json({ error: "Failed to create invite" }, { status: 500 })
  }
}

function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
