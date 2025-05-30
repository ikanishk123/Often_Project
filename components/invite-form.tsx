"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Calendar,
  Upload,
  ImageIcon,
  Video,
  Eye,
  Save,
  Sparkles,
  Users,
  Clock,
  Lock,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { apiClient, type CreateInviteRequest } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface InviteFormData {
  name: string
  media: {
    type: "image" | "video"
    file: File | null
    preview: string
  }
  nights: number
  start_datetime: string
  location_name: string
  location_lat: string
  location_lng: string
  place_id: string
  category_id: string
  description: string
  countries: {
    start: string
    end: string
  }
  tags: string[]
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
}

export default function InviteForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingDraft, setIsLoadingDraft] = useState(false)
  const [formErrors, setFormErrors] = useState<string>("")
  const [storageInfo, setStorageInfo] = useState<{ used: number; available: number; total: number }>({
    used: 0,
    available: 0,
    total: 0,
  })

  const [formData, setFormData] = useState<InviteFormData>({
    name: "",
    media: {
      type: "image",
      file: null,
      preview: "",
    },
    nights: 3,
    start_datetime: "",
    location_name: "",
    location_lat: "",
    location_lng: "",
    place_id: "",
    category_id: "1a80a229-1ad6-405c-accc-28e38e1f2ecc",
    description: "",
    countries: {
      start: "US",
      end: "US",
    },
    tags: [],
    config: {
      capacity: 12,
      enable_waitlist: true,
      guest_approval: true,
      is_public: false,
      password_key: "",
      status: "DRAFT",
      is_ticker: true,
      ticker_text: "",
      place_name: "",
      rules: [],
    },
    custom_links: [],
  })

  // Load draft and storage info on component mount
  useEffect(() => {
    loadDraft()
    updateStorageInfo()
  }, [])

  // Update storage info periodically
  useEffect(() => {
    const interval = setInterval(updateStorageInfo, 5000)
    return () => clearInterval(interval)
  }, [])

  const updateStorageInfo = () => {
    const info = apiClient.getStorageInfo()
    setStorageInfo(info)
  }

  const loadDraft = () => {
    try {
      setIsLoadingDraft(true)
      const draft = apiClient.getDraft()
      if (draft) {
        console.log("📄 Loading saved draft")
        setFormData(draft)
        toast({
          title: "Draft loaded",
          description: "Your previously saved draft has been loaded",
        })
      }
    } catch (error) {
      console.error("Error loading draft:", error)
    } finally {
      setIsLoadingDraft(false)
    }
  }

  const formatDateTime = (dateTimeString: string): string => {
    if (!dateTimeString) return ""
    try {
      // Handle both ISO strings and datetime-local format
      const date = new Date(dateTimeString)
      if (isNaN(date.getTime())) {
        return ""
      }

      // Format for datetime-local input (YYYY-MM-DDTHH:MM)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const hours = String(date.getHours()).padStart(2, "0")
      const minutes = String(date.getMinutes()).padStart(2, "0")

      return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch (error) {
      console.error("Error formatting datetime:", error)
      return ""
    }
  }

  const handleDateTimeChange = (value: string) => {
    try {
      if (value) {
        // Convert datetime-local value to ISO string
        const date = new Date(value)
        if (!isNaN(date.getTime())) {
          setFormData((prev) => ({
            ...prev,
            start_datetime: date.toISOString(),
          }))
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          start_datetime: "",
        }))
      }
    } catch (error) {
      console.error("Error handling datetime change:", error)
    }
  }

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (limit to 10MB for localStorage)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }

      const preview = URL.createObjectURL(file)
      const type = file.type.startsWith("video/") ? "video" : "image"

      setFormData((prev) => ({
        ...prev,
        media: {
          type,
          file,
          preview,
        },
      }))

      // Auto-save draft when media is uploaded
      setTimeout(() => {
        handleSave(true)
      }, 500)
    }
  }

  const handleSave = async (silent = false) => {
    try {
      setIsSaving(true)
      setFormErrors("")

      const success = apiClient.saveDraft(formData)
      if (success) {
        updateStorageInfo()
        if (!silent) {
          toast({
            title: "Draft saved",
            description: "Your invite has been saved as a draft",
          })
        }
      } else {
        throw new Error("Failed to save draft to localStorage")
      }
    } catch (error) {
      console.error("❌ Error saving draft:", error)
      const errorMessage = error instanceof Error ? error.message : "There was a problem saving your draft"
      setFormErrors(errorMessage)
      if (!silent) {
        toast({
          title: "Error saving draft",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    try {
      console.log("👁️ Opening preview...")
      const dataString = encodeURIComponent(JSON.stringify(formData))
      console.log("📦 Preview data size:", dataString.length, "characters")
      router.push(`/view?data=${dataString}`)
    } catch (error) {
      console.error("❌ Error opening preview:", error)
      const errorMessage = "There was a problem opening the preview"
      setFormErrors(errorMessage)
      toast({
        title: "Error opening preview",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: string[] = []

    if (!formData.name.trim()) {
      errors.push("Event name is required")
    }

    if (!formData.start_datetime) {
      errors.push("Start date and time is required")
    } else {
      // Validate that the date is in the future
      const startDate = new Date(formData.start_datetime)
      const now = new Date()
      if (startDate <= now) {
        errors.push("Start date must be in the future")
      }
    }

    if (formData.nights < 1) {
      errors.push("Duration must be at least 1 night")
    }

    if (formData.config.capacity < 1) {
      errors.push("Capacity must be at least 1 person")
    }

    if (errors.length > 0) {
      setFormErrors(errors.join(", "))
      return false
    }

    setFormErrors("")
    return true
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setFormErrors("")
      console.log("🚀 Starting invite creation with localStorage...")

      // Validate form
      if (!validateForm()) {
        return
      }

      // Convert form data to API request format
      const apiRequest: CreateInviteRequest = {
        name: formData.name,
        cover_image_media: formData.media.file,
        nights: formData.nights,
        start_datetime: formData.start_datetime,
        location_name: formData.location_name,
        location_lat: formData.location_lat || "0",
        location_lng: formData.location_lng || "0",
        place_id: formData.place_id || "",
        category_id: formData.category_id,
        description: formData.description,
        soft_delete: false,
        countries: formData.countries,
        tags: formData.tags,
        config: {
          ...formData.config,
          ticker_text:
            formData.config.ticker_text ||
            `${formData.name} • ${new Date(formData.start_datetime).toLocaleDateString()}`,
        },
        custom_links: formData.custom_links,
      }

      console.log("📤 Creating invite with localStorage...")

      // Submit to localStorage
      const response = await apiClient.createInvite(apiRequest)
      console.log("✅ Invite created:", response)

      // Update storage info
      updateStorageInfo()

      // Navigate to the view page with the invite ID
      console.log("🔄 Navigating to invite page:", `/invite/${response.id}`)
      router.push(`/invite/${response.id}`)

      toast({
        title: "Invite created!",
        description: "Your invite has been successfully created and saved locally",
      })
    } catch (error) {
      console.error("❌ Error creating invite:", error)

      let errorMessage = "There was a problem creating your invite"
      if (error instanceof Error) {
        errorMessage = error.message
      }

      setFormErrors(errorMessage)
      toast({
        title: "Error creating invite",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearDraft = () => {
    try {
      apiClient.clearDraft()
      setFormData({
        name: "",
        media: {
          type: "image",
          file: null,
          preview: "",
        },
        nights: 3,
        start_datetime: "",
        location_name: "",
        location_lat: "",
        location_lng: "",
        place_id: "",
        category_id: "1a80a229-1ad6-405c-accc-28e38e1f2ecc",
        description: "",
        countries: {
          start: "US",
          end: "US",
        },
        tags: [],
        config: {
          capacity: 12,
          enable_waitlist: true,
          guest_approval: true,
          is_public: false,
          password_key: "",
          status: "DRAFT",
          is_ticker: true,
          ticker_text: "",
          place_name: "",
          rules: [],
        },
        custom_links: [],
      })
      updateStorageInfo()
      toast({
        title: "Draft cleared",
        description: "Form has been reset and draft cleared",
      })
    } catch (error) {
      console.error("Error clearing draft:", error)
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Storage Info */}
      <div className="xl:col-span-2">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Local Storage:</strong> {formatBytes(storageInfo.used)} used of ~{formatBytes(storageInfo.total)}{" "}
            available. All data is stored locally in your browser.
          </AlertDescription>
        </Alert>
      </div>

      {/* Form Errors */}
      {formErrors && (
        <div className="xl:col-span-2">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formErrors}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Form Section */}
      <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-purple-900/30 dark:to-indigo-900/30 pb-8 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              onClick={loadDraft}
              variant="outline"
              size="sm"
              disabled={isLoadingDraft}
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20"
            >
              {isLoadingDraft ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
            <ThemeToggle />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-emerald-700 to-slate-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-emerald-600 dark:text-purple-400" />
            Invite Details
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Craft your perfect travel invitation (stored locally)
          </p>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Media Upload */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full"></div>
              <Label className="text-xl font-bold text-slate-900 dark:text-white">Media</Label>
            </div>

            <RadioGroup
              value={formData.media.type}
              onValueChange={(value: "image" | "video") =>
                setFormData((prev) => ({ ...prev, media: { ...prev.media, type: value } }))
              }
              className="grid grid-cols-2 gap-4"
            >
              <div className="relative">
                <RadioGroupItem value="image" id="image" className="peer sr-only" />
                <Label
                  htmlFor="image"
                  className="flex items-center justify-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-white/20 dark:border-slate-700/20 rounded-2xl cursor-pointer hover:bg-white/80 dark:hover:bg-slate-800/80 peer-checked:border-green-500 dark:peer-checked:border-purple-500 peer-checked:bg-green-50/50 dark:peer-checked:bg-purple-900/20 transition-all duration-300"
                >
                  <ImageIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Image</span>
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem value="video" id="video" className="peer sr-only" />
                <Label
                  htmlFor="video"
                  className="flex items-center justify-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-white/20 dark:border-slate-700/20 rounded-2xl cursor-pointer hover:bg-white/80 dark:hover:bg-slate-800/80 peer-checked:border-emerald-500 dark:peer-checked:border-indigo-500 peer-checked:bg-emerald-50/50 dark:peer-checked:bg-indigo-900/20 transition-all duration-300"
                >
                  <Video className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">MP4 Video</span>
                </Label>
              </div>
            </RadioGroup>

            <div className="relative group">
              <Input
                type="file"
                accept={formData.media.type === "video" ? "video/mp4,video/quicktime" : "image/*"}
                onChange={handleMediaUpload}
                className="hidden"
                id="media-upload"
              />
              <Label
                htmlFor="media-upload"
                className="flex items-center justify-center w-full h-48 border-2 border-dashed border-white/30 dark:border-slate-700/30 rounded-3xl cursor-pointer hover:border-green-400 dark:hover:border-purple-400 transition-all duration-300 bg-gradient-to-br from-white/40 to-white/20 dark:from-slate-800/40 dark:to-slate-800/20 backdrop-blur-sm group-hover:from-white/60 group-hover:to-white/40 dark:group-hover:from-slate-800/60 dark:group-hover:to-slate-800/40 overflow-hidden"
              >
                {formData.media.preview ? (
                  <div className="relative w-full h-full">
                    {formData.media.type === "video" ? (
                      <video
                        src={formData.media.preview}
                        className="w-full h-full object-cover rounded-3xl"
                        muted
                        loop
                        autoPlay
                      />
                    ) : (
                      <img
                        src={formData.media.preview || "/placeholder.svg"}
                        alt="Media preview"
                        className="w-full h-full object-cover rounded-3xl"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl px-4 py-2">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Change {formData.media.type}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
                      Upload {formData.media.type === "video" ? "MP4 video" : "image"}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Max 10MB • Drag and drop or click to browse
                    </p>
                  </div>
                )}
              </Label>
            </div>
          </div>

          {/* Event Name */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full"></div>
              <Label htmlFor="eventName" className="text-xl font-bold text-slate-900 dark:text-white">
                Event Name *
              </Label>
            </div>
            <Input
              id="eventName"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }))
                // Auto-save draft after typing
                setTimeout(() => handleSave(true), 1000)
              }}
              placeholder="Enter your amazing event name"
              className="h-14 text-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 rounded-2xl px-6 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white/80 dark:focus:bg-slate-800/80 transition-all duration-300"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full"></div>
              <Label htmlFor="location" className="text-xl font-bold text-slate-900 dark:text-white">
                Location
              </Label>
            </div>
            <Input
              id="location"
              value={formData.location_name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, location_name: e.target.value }))
                setTimeout(() => handleSave(true), 1000)
              }}
              placeholder="Enter location (e.g., Big Bear Lake)"
              className="h-14 text-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 rounded-2xl px-6 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white/80 dark:focus:bg-slate-800/80 transition-all duration-300"
            />
          </div>

          {/* Duration (Nights) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full"></div>
              <Label htmlFor="nights" className="text-xl font-bold text-slate-900 dark:text-white">
                Duration (Nights)
              </Label>
            </div>
            <Input
              id="nights"
              type="number"
              value={formData.nights}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, nights: Number.parseInt(e.target.value) || 0 }))
                setTimeout(() => handleSave(true), 1000)
              }}
              className="h-14 text-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 rounded-2xl px-6 focus:bg-white/80 dark:focus:bg-slate-800/80 transition-all duration-300"
              min="1"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full"></div>
              <Label htmlFor="startDate" className="text-xl font-bold text-slate-900 dark:text-white">
                Start Date & Time *
              </Label>
            </div>
            <div className="relative">
              <Input
                id="startDate"
                type="datetime-local"
                value={formatDateTime(formData.start_datetime)}
                onChange={(e) => {
                  handleDateTimeChange(e.target.value)
                  setTimeout(() => handleSave(true), 1000)
                }}
                className="h-14 text-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 rounded-2xl pl-14 pr-6 focus:bg-white/80 dark:focus:bg-slate-800/80 transition-all duration-300"
                required
              />
              <Calendar className="w-6 h-6 text-slate-400 dark:text-slate-500 absolute left-4 top-4" />
            </div>
          </div>

          {/* Event Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full"></div>
              <Label htmlFor="description" className="text-xl font-bold text-slate-900 dark:text-white">
                Event Description
              </Label>
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, description: e.target.value }))
                setTimeout(() => handleSave(true), 1000)
              }}
              placeholder="Tell everyone about this incredible adventure..."
              className="min-h-[140px] text-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 rounded-2xl p-6 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white/80 dark:focus:bg-slate-800/80 transition-all duration-300 resize-none"
            />
          </div>

          {/* Configuration Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full"></div>
              <Label className="text-xl font-bold text-slate-900 dark:text-white">Event Configuration</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Capacity */}
              <div className="space-y-3">
                <Label
                  htmlFor="capacity"
                  className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.config.capacity}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      config: { ...prev.config, capacity: Number.parseInt(e.target.value) || 0 },
                    }))
                    setTimeout(() => handleSave(true), 1000)
                  }}
                  className="h-12 text-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 rounded-2xl px-4 focus:bg-white/80 dark:focus:bg-slate-800/80 transition-all duration-300"
                  min="1"
                />
              </div>

              {/* Password */}
              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  Password Key
                </Label>
                <Input
                  id="password"
                  type="text"
                  value={formData.config.password_key}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      config: { ...prev.config, password_key: e.target.value },
                    }))
                    setTimeout(() => handleSave(true), 1000)
                  }}
                  placeholder="Optional password"
                  className="h-12 text-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 rounded-2xl px-4 focus:bg-white/80 dark:focus:bg-slate-800/80 transition-all duration-300"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Guest Approval</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Manually approve attendees</p>
                </div>
                <Switch
                  checked={formData.config.guest_approval}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      config: { ...prev.config, guest_approval: checked },
                    }))
                    setTimeout(() => handleSave(true), 500)
                  }}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500 dark:data-[state=checked]:from-purple-500 dark:data-[state=checked]:to-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Enable Waitlist</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Allow waitlist when full</p>
                </div>
                <Switch
                  checked={formData.config.enable_waitlist}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      config: { ...prev.config, enable_waitlist: checked },
                    }))
                    setTimeout(() => handleSave(true), 500)
                  }}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500 dark:data-[state=checked]:from-purple-500 dark:data-[state=checked]:to-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Public Event</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Visible to everyone</p>
                </div>
                <Switch
                  checked={formData.config.is_public}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      config: { ...prev.config, is_public: checked },
                    }))
                    setTimeout(() => handleSave(true), 500)
                  }}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500 dark:data-[state=checked]:from-purple-500 dark:data-[state=checked]:to-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Show Ticker</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Display event ticker</p>
                </div>
                <Switch
                  checked={formData.config.is_ticker}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      config: { ...prev.config, is_ticker: checked },
                    }))
                    setTimeout(() => handleSave(true), 500)
                  }}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500 dark:data-[state=checked]:from-purple-500 dark:data-[state=checked]:to-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-8">
            <Button
              onClick={() => handleSave(false)}
              variant="outline"
              disabled={isSaving}
              className="flex-1 h-14 text-lg font-semibold bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-2xl transition-all duration-300"
            >
              {isSaving ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
              Save Draft
            </Button>
            <Button
              onClick={clearDraft}
              variant="outline"
              className="h-14 px-6 text-lg font-semibold bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-2xl transition-all duration-300"
            >
              Clear
            </Button>
            <Button
              onClick={handlePreview}
              className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-purple-600 dark:to-indigo-600 hover:from-green-700 hover:to-emerald-700 dark:hover:from-purple-700 dark:hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Eye className="w-5 h-5 mr-3" />
              Preview
            </Button>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name || !formData.start_datetime}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-purple-600 dark:to-indigo-600 hover:from-green-700 hover:to-emerald-700 dark:hover:from-purple-700 dark:hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Creating Invite...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                Create Invite
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Live Preview Section */}
      <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden sticky top-8">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-purple-900/30 dark:to-indigo-900/30 pb-8">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-emerald-700 to-slate-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent flex items-center gap-3">
            <Eye className="w-8 h-8 text-emerald-600 dark:text-purple-400" />
            Live Preview
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Watch your invite come to life</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="relative aspect-[9/16] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            {formData.media.preview ? (
              formData.media.type === "video" ? (
                <video
                  src={formData.media.preview}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  loop
                  autoPlay
                />
              ) : (
                <img
                  src={formData.media.preview || "/placeholder.svg"}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )
            ) : null}

            {/* Live Preview Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  ✨ Travel Invite
                </div>
                <h2 className="text-3xl font-bold leading-tight">{formData.name || "Your Amazing Event"}</h2>
                {formData.location_name && <p className="text-lg opacity-90">📍 {formData.location_name}</p>}
                {formData.start_datetime && (
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(formData.start_datetime).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {formData.nights > 0 && <span>• {formData.nights} nights</span>}
                  </div>
                )}
                <p className="text-sm opacity-90 line-clamp-3 leading-relaxed">
                  {formData.description ||
                    "An incredible adventure awaits. Join us for an unforgettable experience that will create memories to last a lifetime."}
                </p>
                <div className="flex items-center justify-between text-xs opacity-75 pt-2 border-t border-white/20">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{formData.config.capacity} spots</span>
                  </div>
                  {formData.config.guest_approval && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Approval Required</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Floating elements for empty state */}
            {!formData.media.preview && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-slate-500 dark:text-slate-400">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400/20 to-emerald-400/20 dark:from-purple-400/20 dark:to-indigo-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium">Upload media to see preview</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
