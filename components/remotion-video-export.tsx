"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Video, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { trackEvent } from "@/lib/analytics"
import { FEATURES } from "@/lib/config"

interface RemotionVideoExportProps {
  inviteData: any
  className?: string
}

export default function RemotionVideoExport({ inviteData, className = "" }: RemotionVideoExportProps) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportVideo = async () => {
    if (!FEATURES.ENABLE_REMOTION) {
      toast({
        title: "Video export disabled",
        description: "Remotion video export is not enabled. Set NEXT_PUBLIC_ENABLE_REMOTION=true to enable.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsExporting(true)

      // Track the export attempt
      trackEvent("video_export_started", "remotion", inviteData.name)

      // In a real implementation, this would call your Remotion rendering API
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate successful export
      const videoUrl = "/placeholder-video.mp4" // This would be the actual rendered video URL

      // Create download link
      const link = document.createElement("a")
      link.href = videoUrl
      link.download = `${inviteData.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_invite.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      trackEvent("video_export_completed", "remotion", inviteData.name)

      toast({
        title: "Video exported",
        description: "Your invite video has been generated and downloaded",
      })
    } catch (error) {
      console.error("Video export error:", error)
      trackEvent("video_export_failed", "remotion", inviteData.name)

      toast({
        title: "Export failed",
        description: "There was an error generating your video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  if (!FEATURES.ENABLE_REMOTION) {
    return null
  }

  return (
    <Button
      onClick={handleExportVideo}
      disabled={isExporting}
      className={`${className} bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white`}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Exporting Video...
        </>
      ) : (
        <>
          <Video className="w-4 h-4 mr-2" />
          Export Video
        </>
      )}
    </Button>
  )
}
