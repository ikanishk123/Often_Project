export const API_CONFIG = {
  // Use the live backend URL from environment variable
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api/mock",

  // API endpoints
  ENDPOINTS: {
    INVITES: "/invites",
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      PROFILE: "/auth/profile",
    },
    HEALTH: "/health",
  },

  // Request configuration
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
}

// Feature flags
export const FEATURES = {
  // Enable/disable features based on environment
  USE_LIVE_API: !!process.env.NEXT_PUBLIC_API_URL,
  ENABLE_AUTHENTICATION: true,
  ENABLE_VIDEO_DOWNLOAD: true,
  ENABLE_ANALYTICS: true,
  ENABLE_REAL_TIME_UPDATES: false,
}

// Application constants
export const APP_CONFIG = {
  NAME: "Travel Invite Platform",
  VERSION: "1.0.0",
  DESCRIPTION: "Create stunning travel invites with AI-powered design",

  // File upload limits
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/quicktime"],

  // Invite limits
  MAX_INVITE_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_CUSTOM_LINKS: 10,
  MAX_RULES: 20,
}

// Helper function to get the correct API URL
export function getApiUrl(): string {
  const baseUrl = API_CONFIG.BASE_URL

  // If we're in the browser
  if (typeof window !== "undefined") {
    // If it's a relative URL (starts with /), make sure it's relative to the current origin
    if (baseUrl.startsWith("/")) {
      // For mock API, ensure we're using the current origin
      return `${window.location.origin}${baseUrl}`
    }

    // If it's an absolute URL, use it as is
    return baseUrl
  }

  // If we're on the server and it's a relative URL
  if (baseUrl.startsWith("/")) {
    // In development, we can use the relative URL
    // In production, we should have NEXT_PUBLIC_API_URL set
    if (process.env.NODE_ENV === "development") {
      return baseUrl
    } else if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL
    } else {
      console.warn("No API URL configured for production. Falling back to mock API.")
      return "/api/mock"
    }
  }

  // If it's an absolute URL on the server, use it as is
  return baseUrl
}

// Validate environment configuration
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check if API URL is configured for production
  if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_API_URL) {
    errors.push("NEXT_PUBLIC_API_URL is required in production")
  }

  // Validate API URL format
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      new URL(process.env.NEXT_PUBLIC_API_URL)
    } catch {
      if (!process.env.NEXT_PUBLIC_API_URL.startsWith("/")) {
        errors.push("NEXT_PUBLIC_API_URL must be a valid URL or relative path")
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Log configuration in development
if (process.env.NODE_ENV === "development") {
  const config = validateConfig()
  console.log("🔧 API Config:", {
    BASE_URL: API_CONFIG.BASE_URL,
    USE_LIVE_API: FEATURES.USE_LIVE_API,
    RESOLVED_URL: typeof window !== "undefined" ? getApiUrl() : "server-side",
    IS_VALID: config.isValid,
    ERRORS: config.errors,
  })
}
