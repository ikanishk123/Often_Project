import { NextResponse } from "next/server"

// This is a mock API route for user registration
export async function POST(request: Request) {
  try {
    console.log("🔥 Mock API: POST /api/mock/auth/register called")

    // Parse the request body
    const body = await request.json()
    console.log("📦 Request body:", {
      name: body.name,
      email: body.email,
      hasPassword: !!body.password,
    })

    // Validate required fields
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "Name, email, and password are required",
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          error: "Invalid email",
          message: "Please provide a valid email address",
        },
        { status: 400 },
      )
    }

    // Validate password length
    if (body.password.length < 6) {
      return NextResponse.json(
        {
          error: "Invalid password",
          message: "Password must be at least 6 characters long",
        },
        { status: 400 },
      )
    }

    // Generate a mock user ID and token
    const userId = crypto.randomUUID()
    const token = `mock_token_${Math.random().toString(36).substring(2, 15)}`

    // Create a mock user response
    const user = {
      id: userId,
      name: body.name,
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
        error: "Registration failed",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
