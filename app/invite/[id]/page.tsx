"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, Copy, Check } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import InvitePreview from "@/components/invite-preview"
import { apiClient, type InviteResponse } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [invite, setInvite] = useState<InviteResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

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

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // Use the modern clipboard API if available
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand("copy")
        textArea.remove()
      }

      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)

      toast({
        title: "Link copied",
        description: "Invite link copied to clipboard",
      })
    } catch (err) {
      console.error("Failed to copy to clipboard:", err)
      toast({
        title: "Copy failed",
        description: "Unable to copy link. Please copy manually from the address bar.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: invite?.name || "Travel Invite",
      text: invite?.description || "Check out this travel invite!",
      url: window.location.href,
    }

    // Check if Web Share API is available and supported
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        console.log("Successfully shared")
      } catch (err) {
        console.error("Error sharing:", err)
        // If sharing fails, fall back to copying the link
        if (err instanceof Error && err.name !== "AbortError") {
          // AbortError means user cancelled, don't show error for that
          await copyToClipboard(window.location.href)
        }
      }
    } else {
      // Fallback: copy to clipboard
      await copyToClipboard(window.location.href)
    }
  }

  const handleCopyLink = async () => {
    await copyToClipboard(window.location.href)
  }

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(invite?.name || "Travel Invite")
    const body = encodeURIComponent(
      `Check out this amazing travel invite: ${invite?.name || "Travel Event"}\n\n${invite?.description || ""}\n\nView details: ${window.location.href}`,
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const handleShareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out this travel invite: ${invite?.name || "Travel Event"}\n${window.location.href}`,
    )
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  const handleShareViaTwitter = () => {
    const text = encodeURIComponent(`Check out this amazing travel invite: ${invite?.name || "Travel Event"}`)
    const url = encodeURIComponent(window.location.href)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank")
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
              <Link href="/invites">
                <Button
                  variant="outline"
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Invites
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

              {/* Share Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-white/20 dark:border-slate-700/20 rounded-2xl p-2 min-w-[200px]"
                >
                  <DropdownMenuItem onClick={handleShare} className="cursor-pointer rounded-xl">
                    <Share2 className="w-4 h-4 mr-2" />
                    Quick Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer rounded-xl">
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareViaEmail} className="cursor-pointer rounded-xl">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareViaWhatsApp} className="cursor-pointer rounded-xl">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareViaTwitter} className="cursor-pointer rounded-xl">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Twitter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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
