import { NextResponse } from "next/server"

// This is a mock API route for user login
export async function POST(request: Request) {
  try {
    console.log("🔥 Mock API: POST /api/mock/auth/login called")

    // Parse the request body
    const body = await request.json()
    console.log("📦 Request body:", {
      email: body.email,
      hasPassword: !!body.password,
    })

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          error: "Missing credentials",
          message: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // For demo purposes, accept any valid email/password
    // In a real app, you would validate against a database
    if (body.password.length < 6) {
      return NextResponse.json(
        {
          error: "Authentication failed",
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Generate a mock token
    const token = `mock_token_${Math.random().toString(36).substring(2, 15)}`

    // Create a mock user based on the email
    const user = {
      id: crypto.randomUUID(),
      name: body.email
        .split("@")[0]
        .replace(/[^a-zA-Z0-9]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      email: body.email,
      often_user_id: Math.floor(Math.random() * 10000),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Return a successful response
    return NextResponse.json({
      token,
      user,
    })
  } catch (error) {
    console.error("❌ Mock API Error:", error)
    return NextResponse.json(
      {
        error: "Authentication failed",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
