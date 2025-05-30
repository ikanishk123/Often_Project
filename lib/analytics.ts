import { ANALYTICS_CONFIG, FEATURES } from "@/lib/config"

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

/**
 * Initialize Google Analytics
 */
export function initializeAnalytics(): void {
  if (!FEATURES.ENABLE_ANALYTICS || !ANALYTICS_CONFIG.GA_TRACKING_ID) {
    console.log("Analytics disabled or not configured")
    return
  }

  // Load Google Analytics script
  const script1 = document.createElement("script")
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA_TRACKING_ID}`
  document.head.appendChild(script1)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag("js", new Date())
  window.gtag("config", ANALYTICS_CONFIG.GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  })

  console.log("Google Analytics initialized:", ANALYTICS_CONFIG.GA_TRACKING_ID)
}

/**
 * Track page views
 */
export function trackPageView(url: string, title?: string): void {
  if (!FEATURES.ENABLE_ANALYTICS || typeof window.gtag !== "function") {
    return
  }

  window.gtag("config", ANALYTICS_CONFIG.GA_TRACKING_ID, {
    page_path: url,
    page_title: title,
  })
}

/**
 * Track custom events
 */
export function trackEvent(action: string, category: string, label?: string, value?: number): void {
  if (!FEATURES.ENABLE_ANALYTICS || typeof window.gtag !== "function") {
    return
  }

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

/**
 * Track invite creation
 */
export function trackInviteCreated(inviteData: {
  name: string
  location?: string
  nights: number
  capacity: number
}): void {
  trackEvent("invite_created", "invites", "create_invite", 1)

  // Track additional details
  trackEvent("invite_nights", "invites", `${inviteData.nights}_nights`, inviteData.nights)
  trackEvent("invite_capacity", "invites", `${inviteData.capacity}_capacity`, inviteData.capacity)

  if (inviteData.location) {
    trackEvent("invite_location", "invites", inviteData.location, 1)
  }
}

/**
 * Track invite views
 */
export function trackInviteViewed(inviteId: string): void {
  trackEvent("invite_viewed", "invites", inviteId, 1)
}

/**
 * Track invite shares
 */
export function trackInviteShared(method: string, inviteId: string): void {
  trackEvent("invite_shared", "sharing", method, 1)
  trackEvent("share_method", "sharing", method, 1)
}

/**
 * Track media uploads
 */
export function trackMediaUpload(type: "image" | "video", size: number): void {
  trackEvent("media_upload", "media", type, 1)
  trackEvent("media_size", "media", `${Math.round(size / 1024 / 1024)}mb`, Math.round(size / 1024 / 1024))
}

/**
 * Track errors
 */
export function trackError(error: string, category = "general"): void {
  trackEvent("error", category, error, 1)
}

/**
 * Track user engagement
 */
export function trackEngagement(action: string, element?: string): void {
  trackEvent(action, "engagement", element, 1)
}
