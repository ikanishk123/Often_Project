"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, Cloud } from "lucide-react"
import { uploadToCloudinary, type CloudinaryUploadResult } from "@/lib/cloudinary"
import { trackMediaUpload, trackError } from "@/lib/analytics"
import { useToast } from "@/hooks/use-toast"
import { FEATURES } from "@/lib/config"

interface CloudinaryUploadProps {
  onUploadComplete: (result: CloudinaryUploadResult) => void
  onUploadStart?: () => void
  accept?: string
  maxSize?: number
  className?: string
  children?: React.ReactNode
}

export default function CloudinaryUpload({
  onUploadComplete,
  onUploadStart,
  accept = "image/*,video/*",
  maxSize = 50 * 1024 * 1024, // 50MB
  className = "",
  children,
}: CloudinaryUploadProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / 1024 / 1024)
      toast({
        title: "File too large",
        description: `Please select a file smaller than ${maxSizeMB}MB`,
        variant: "destructive",
      })
      trackError(`file_too_large_${Math.round(file.size / 1024 / 1024)}mb`, "upload")
      return
    }

    try {
      setIsUploading(true)
      onUploadStart?.()

      if (!FEATURES.ENABLE_CLOUDINARY) {
        // Fallback to local file handling
        const result: CloudinaryUploadResult = {
          public_id: `local_${Date.now()}`,
          secure_url: URL.createObjectURL(file),
          url: URL.createObjectURL(file),
          format: file.type.split("/")[1] || "unknown",
          resource_type: file.type.startsWith("video/") ? "video" : "image",
          bytes: file.size,
        }

        onUploadComplete(result)
        toast({
          title: "File uploaded",
          description: "File uploaded successfully (local storage)",
        })
        return
      }

      const result = await uploadToCloudinary(file)

      onUploadComplete(result)
      trackMediaUpload(file.type.startsWith("video/") ? "video" : "image", file.size)

      toast({
        title: "Upload successful",
        description: "Your file has been uploaded to Cloudinary",
      })
    } catch (error) {
      console.error("Upload error:", error)
      const errorMessage = error instanceof Error ? error.message : "Upload failed"

      trackError(errorMessage, "upload")
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset the input
      event.target.value = ""
    }
  }

  return (
    <div className={className}>
      <input
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
        id="cloudinary-upload"
      />
      <label htmlFor="cloudinary-upload" className="cursor-pointer">
        {children || (
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              {isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
              ) : FEATURES.ENABLE_CLOUDINARY ? (
                <Cloud className="w-8 h-8 text-gray-500" />
              ) : (
                <Upload className="w-8 h-8 text-gray-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {isUploading ? "Uploading..." : FEATURES.ENABLE_CLOUDINARY ? "Upload to Cloudinary" : "Upload File"}
              </span>
              <span className="text-xs text-gray-500">{Math.round(maxSize / 1024 / 1024)}MB max</span>
            </div>
          </Button>
        )}
      </label>
    </div>
  )
}
