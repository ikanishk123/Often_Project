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

// Authentication configuration
export const AUTH_CONFIG = {
  DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN || "",
  CLIENT_ID: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || "",
  REDIRECT_URI: typeof window !== "undefined" ? `${window.location.origin}/callback` : "",
  LOGOUT_URI: typeof window !== "undefined" ? `${window.location.origin}` : "",
}

// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
  API_URL: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    ? `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`
    : "",
}

// Analytics configuration
export const ANALYTICS_CONFIG = {
  GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID || "",
  ENABLED: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
}

// Feature flags
export const FEATURES = {
  // Enable/disable features based on environment
  USE_LIVE_API: !!process.env.NEXT_PUBLIC_API_URL,
  ENABLE_AUTHENTICATION: !!AUTH_CONFIG.DOMAIN && !!AUTH_CONFIG.CLIENT_ID,
  ENABLE_CLOUDINARY: !!CLOUDINARY_CONFIG.CLOUD_NAME && !!CLOUDINARY_CONFIG.UPLOAD_PRESET,
  ENABLE_VIDEO_DOWNLOAD: true,
  ENABLE_ANALYTICS: ANALYTICS_CONFIG.ENABLED,
  ENABLE_REAL_TIME_UPDATES: false,
  ENABLE_REMOTION: process.env.NEXT_PUBLIC_ENABLE_REMOTION === "true",
}

// Application constants
export const APP_CONFIG = {
  NAME: "Travel Invite Platform",
  VERSION: "1.0.0",
  DESCRIPTION: "Create stunning travel invites with beautiful design",

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
export function validateConfig(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if API URL is configured for production
  if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_API_URL) {
    warnings.push("NEXT_PUBLIC_API_URL is not set - using mock API")
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

  // Validate Auth configuration
  if (process.env.NEXT_PUBLIC_AUTH_DOMAIN && !process.env.NEXT_PUBLIC_AUTH_CLIENT_ID) {
    errors.push("NEXT_PUBLIC_AUTH_CLIENT_ID is required when NEXT_PUBLIC_AUTH_DOMAIN is set")
  }
  if (process.env.NEXT_PUBLIC_AUTH_CLIENT_ID && !process.env.NEXT_PUBLIC_AUTH_DOMAIN) {
    errors.push("NEXT_PUBLIC_AUTH_DOMAIN is required when NEXT_PUBLIC_AUTH_CLIENT_ID is set")
  }

  // Validate Cloudinary configuration
  if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
    warnings.push("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is recommended when using Cloudinary")
  }
  if (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET && !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    errors.push("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is required when NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is set")
  }

  // Validate Analytics configuration
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" && !process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
    warnings.push("NEXT_PUBLIC_GA_TRACKING_ID is required when analytics is enabled")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// Log configuration in development
if (process.env.NODE_ENV === "development") {
  const config = validateConfig()
  console.log("🔧 Configuration Status:", {
    API: {
      BASE_URL: API_CONFIG.BASE_URL,
      USE_LIVE_API: FEATURES.USE_LIVE_API,
    },
    AUTH: {
      ENABLED: FEATURES.ENABLE_AUTHENTICATION,
      DOMAIN: AUTH_CONFIG.DOMAIN ? "✓ Set" : "✗ Not set",
      CLIENT_ID: AUTH_CONFIG.CLIENT_ID ? "✓ Set" : "✗ Not set",
    },
    CLOUDINARY: {
      ENABLED: FEATURES.ENABLE_CLOUDINARY,
      CLOUD_NAME: CLOUDINARY_CONFIG.CLOUD_NAME ? "✓ Set" : "✗ Not set",
      UPLOAD_PRESET: CLOUDINARY_CONFIG.UPLOAD_PRESET ? "✓ Set" : "✗ Not set",
    },
    ANALYTICS: {
      ENABLED: FEATURES.ENABLE_ANALYTICS,
      GA_ID: ANALYTICS_CONFIG.GA_TRACKING_ID ? "✓ Set" : "✗ Not set",
    },
    FEATURES: {
      REMOTION: FEATURES.ENABLE_REMOTION,
    },
    VALIDATION: {
      IS_VALID: config.isValid,
      ERRORS: config.errors,
      WARNINGS: config.warnings,
    },
  })
}
