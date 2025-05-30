import { NextResponse } from "next/server"

// This is a mock API route for user logout
export async function POST(request: Request) {
  try {
    console.log("🔥 Mock API: POST /api/mock/auth/logout called")

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

    // In a real app, you would invalidate the token
    // For demo purposes, we'll just return a success response

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("❌ Mock API Error:", error)
    return NextResponse.json(
      {
        error: "Logout failed",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
