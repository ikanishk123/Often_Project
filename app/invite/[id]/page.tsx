"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import InvitePreview from "@/components/invite-preview"
import { apiClient, type InviteResponse } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [invite, setInvite] = useState<InviteResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const id = typeof params.id === "string" ? params.id : params.id?.[0] || ""

  useEffect(() => {
    async function fetchInvite() {
      if (!id) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await apiClient.getInvite(id)
        setInvite(data)
      } catch (err) {
        console.error("Error fetching invite:", err)
        setError("Failed to load invite. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load invite details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvite()
  }, [id, toast])

  const handleDownloadVideo = async () => {
    // Implement video download functionality
    toast({
      title: "Coming soon",
      description: "Video download functionality will be available soon",
    })
  }

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator
        .share({
          title: invite?.name || "Travel Invite",
          text: invite?.description || "Check out this travel invite!",
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
        })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Invite link copied to clipboard",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center relative">
        <div className="absolute inset-0 overflow-hidden">
          {/* Light mode green circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl dark:opacity-0"></div>

          {/* Dark mode purple circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full blur-3xl opacity-0 dark:opacity-100"></div>
        </div>

        <div className="text-center p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 rounded-3xl shadow-2xl relative z-10">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Loading invite...</h2>
          <p className="text-slate-600 dark:text-slate-300">Please wait while we fetch the invite details</p>
        </div>
      </div>
    )
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center relative">
        <div className="absolute inset-0 overflow-hidden">
          {/* Light mode green circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl dark:opacity-0"></div>

          {/* Dark mode purple circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full blur-3xl opacity-0 dark:opacity-100"></div>
        </div>

        <div className="text-center p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 rounded-3xl shadow-2xl relative z-10">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Error Loading Invite</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">{error || "Invite not found or has been deleted."}</p>
          <Link href="/create">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-purple-600 dark:to-indigo-600 hover:from-green-700 hover:to-emerald-700 dark:hover:from-purple-700 dark:hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Create New Invite
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Transform API response to match the format expected by InvitePreview
  const previewData = {
    id: invite.id,
    name: invite.name,
    media: {
      type: invite.cover_image_media?.includes(".mp4") ? "video" : "image",
      file: null,
      preview: invite.cover_image_media || "",
    },
    nights: invite.nights,
    start_datetime: invite.start_datetime,
    location_name: invite.location_name,
    description: invite.description,
    host: invite.host,
    config: invite.config,
    custom_links: invite.custom_links,
    category: invite.category,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Light mode green circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl dark:opacity-0"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl dark:opacity-0"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-3xl dark:opacity-0"></div>

        {/* Dark mode purple circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full blur-3xl opacity-0 dark:opacity-100"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full blur-3xl opacity-0 dark:opacity-100"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl opacity-0 dark:opacity-100"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-6">
              <Link href="/create">
                <Button
                  variant="outline"
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Create New
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-emerald-700 to-slate-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent">
                  {invite.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-lg">Invite ID: {invite.id}</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <ThemeToggle />
              <Button
                onClick={handleShare}
                variant="outline"
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                onClick={handleDownloadVideo}
                className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-purple-600 dark:to-indigo-600 hover:from-green-700 hover:to-emerald-700 dark:hover:from-purple-700 dark:hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Video
              </Button>
            </div>
          </div>
          <InvitePreview data={previewData} />
        </div>
      </div>
    </div>
  )
}
