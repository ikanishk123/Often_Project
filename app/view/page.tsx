"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import InvitePreview from "@/components/invite-preview"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { apiClient, type CreateInviteRequest } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export default function ViewPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [inviteData, setInviteData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const data = searchParams.get("data")
    if (data) {
      try {
        setInviteData(JSON.parse(decodeURIComponent(data)))
      } catch (error) {
        console.error("Error parsing invite data:", error)
      }
    }
  }, [searchParams])

  const handleDownloadVideo = async () => {
    toast({
      title: "Coming soon",
      description: "Video download functionality will be available soon",
    })
  }

  const handleCreateInvite = async () => {
    if (!inviteData) return

    try {
      setIsSubmitting(true)

      // Convert form data to API request format
      const apiRequest: CreateInviteRequest = {
        name: inviteData.name,
        cover_image_media: inviteData.media?.file || null,
        nights: inviteData.nights,
        start_datetime: inviteData.start_datetime,
        location_name: inviteData.location_name,
        location_lat: inviteData.location_lat || "0",
        location_lng: inviteData.location_lng || "0",
        place_id: inviteData.place_id || "",
        category_id: inviteData.category_id,
        description: inviteData.description,
        soft_delete: false,
        countries: inviteData.countries,
        tags: inviteData.tags,
        config: {
          ...inviteData.config,
          ticker_text:
            inviteData.config.ticker_text ||
            `${inviteData.name} • ${new Date(inviteData.start_datetime).toLocaleDateString()}`,
        },
        custom_links: inviteData.custom_links,
      }

      // Submit to API
      const response = await apiClient.createInvite(apiRequest)

      // Navigate to the view page with the real invite ID
      router.push(`/invite/${response.id}`)

      toast({
        title: "Invite created!",
        description: "Your invite has been successfully created",
      })
    } catch (error) {
      console.error("Error creating invite:", error)
      toast({
        title: "Error creating invite",
        description: error instanceof Error ? error.message : "There was a problem creating your invite",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center relative">
        {/* Background decorative elements */}
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
            <ArrowLeft className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No invite data found</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">Create a beautiful travel invite to get started</p>
          <Link href="/create">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-purple-600 dark:to-indigo-600 hover:from-green-700 hover:to-emerald-700 dark:hover:from-purple-700 dark:hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Create New Invite
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Transform preview data to match the format expected by InvitePreview
  const previewData = {
    id: "",
    name: inviteData.name,
    media: inviteData.media,
    nights: inviteData.nights,
    start_datetime: inviteData.start_datetime,
    location_name: inviteData.location_name,
    description: inviteData.description,
    config: inviteData.config,
    custom_links: inviteData.custom_links || [],
    category: { name: "Travel", id: inviteData.category_id },
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
                  Back to Edit
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-emerald-700 to-slate-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent">
                  Invite Preview
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-lg">Your masterpiece is ready to share</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <ThemeToggle />
              <Button
                onClick={handleDownloadVideo}
                variant="outline"
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={handleCreateInvite}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-purple-600 dark:to-indigo-600 hover:from-green-700 hover:to-emerald-700 dark:hover:from-purple-700 dark:hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Invite
                  </>
                )}
              </Button>
            </div>
          </div>
          <InvitePreview data={previewData} />
        </div>
      </div>
    </div>
  )
}
