"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, CheckCircle, Star } from "lucide-react"
import { useTheme } from "next-themes"

interface InvitePreviewProps {
  data: {
    id?: string
    name: string
    media?: {
      type: "image" | "video"
      file: File | null
      preview: string
    }
    nights: number
    start_datetime: string
    location_name: string
    description: string
    host?: {
      name: string
      email: string
    }
    config: {
      capacity: number
      enable_waitlist: boolean
      guest_approval: boolean
      is_public: boolean
      password_key: string
      status: string
      is_ticker: boolean
      ticker_text: string
      place_name: string
      rules: string[]
    }
    custom_links: Array<{
      emoji: string
      label: string
      url: string
    }>
    category?: {
      name: string
    }
  }
}

export default function InvitePreview({ data }: InvitePreviewProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
        <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          {data.media?.preview ? (
            data.media.type === "video" ? (
              <video
                src={data.media.preview}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                autoPlay
              />
            ) : (
              <img
                src={data.media.preview || "/placeholder.svg"}
                alt="Event background"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 dark:from-purple-600/20 dark:to-indigo-600/20"></div>
          )}

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-12 text-white">
            <div className="space-y-6">
              {data.config.is_ticker && data.config.ticker_text && (
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {data.config.ticker_text}
                </div>
              )}

              <h1 className="text-6xl font-bold leading-tight">{data.name}</h1>

              {data.location_name && <p className="text-2xl opacity-90">📍 {data.location_name}</p>}

              {data.start_datetime && (
                <div className="flex items-center gap-3 text-xl">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {new Date(data.start_datetime).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-white/80 text-lg">
                      {new Date(data.start_datetime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • {data.nights} nights
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating stats */}
          <div className="absolute top-8 right-8 flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-white text-center">
              <Users className="w-5 h-5 mx-auto mb-1" />
              <p className="text-sm font-semibold">{data.config.capacity}</p>
              <p className="text-xs opacity-80">spots</p>
            </div>
            {data.config.guest_approval && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-white text-center">
                <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs opacity-80">Approval</p>
                <p className="text-xs opacity-80">Required</p>
              </div>
            )}
            {data.category && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-white text-center">
                <Star className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs opacity-80">{data.category.name}</p>
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-12 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-500" />
                  About This Experience
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">{data.description}</p>
              </div>

              {/* Custom Links */}
              {data.custom_links && data.custom_links.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Helpful Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.custom_links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-300"
                      >
                        <span className="text-2xl">{link.emoji}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules */}
              {data.config.rules && data.config.rules.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Event Rules</h4>
                  <div className="space-y-2">
                    {data.config.rules.map((rule, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full"></div>
                        <span className="text-slate-700 dark:text-slate-300">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Host Info */}
              {data.host && (
                <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-800/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 dark:border-slate-700/20">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Hosted by</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {data.host.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{data.host.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{data.host.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Event Details */}
              <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-800/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 dark:border-slate-700/20">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Event Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">{data.nights} nights duration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">
                      {data.config.is_public ? "Public Event" : "Private Event"}
                    </span>
                  </div>
                  {data.config.enable_waitlist && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full"></div>
                      <span className="text-slate-700 dark:text-slate-300">Waitlist Available</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Status: {data.config.status}</span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Info</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Capacity</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{data.config.capacity} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Approval</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {data.config.guest_approval ? "Required" : "Not Required"}
                    </span>
                  </div>
                  {data.config.place_name && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Venue</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{data.config.place_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
