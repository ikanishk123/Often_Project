"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
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
          ticker_text: inviteData.config.ticker_text || `${inviteData.name} • ${new Date(inviteData.start_datetime).toLocaleDateString()}`,
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
            <Button className="bg-gradient-to\
