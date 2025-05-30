import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic health check
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      api: {
        status: "operational",
        endpoints: {
          invites: "/api/invites",
          auth: "/api/auth",
          health: "/api/health",
        },
      },
      features: {
        authentication: true,
        file_upload: true,
        real_time_updates: false,
      },
    }

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Health check failed:", error)

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 503 },
    )
  }
}
