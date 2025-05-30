import { NextResponse } from "next/server"

// This is a mock API route for getting user profile
export async function GET(request: Request) {
  try {
    console.log("🔥 Mock API: GET /api/mock/auth/profile called")

    // Check for authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication required",
        },
        { status: 401 },
      )
    }

    // Extract token
    const token = authHeader.split(" ")[1]
    console.log("🔑 Token:", token.substring(0, 10) + "...")

    // In a real app, you would validate the token
    // For demo purposes, we'll just check if it starts with "mock_token"
    if (!token.startsWith("mock_token_")) {
      return NextResponse.json(
        {
          error: "Invalid token",
          message: "Authentication failed",
        },
        { status: 401 },
      )
    }

    // Return a mock user profile
    return NextResponse.json({
      id: crypto.randomUUID(),
      name: "Demo User",
      email: "user@example.com",
      often_user_id: Math.floor(Math.random() * 10000),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Mock API Error:", error)
    return NextResponse.json(
      {
        error: "Profile fetch failed",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

// This is a mock API route for updating user profile
export async function PUT(request: Request) {
  try {
    console.log("🔥 Mock API: PUT /api/mock/auth/profile called")

    // Check for authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication required",
        },
        { status: 401 },
      )
    }

    // Extract token
    const token = authHeader.split(" ")[1]
    console.log("🔑 Token:", token.substring(0, 10) + "...")

    // Parse the request body
    const body = await request.json()
    console.log("📦 Request body:", body)

    // Return the updated user profile
    return NextResponse.json({
      id: crypto.randomUUID(),
      name: body.name || "Updated User",
      email: body.email || "updated@example.com",
      often_user_id: Math.floor(Math.random() * 10000),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Mock API Error:", error)
    return NextResponse.json(
      {
        error: "Profile update failed",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
