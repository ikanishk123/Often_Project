"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { PlusCircle, Calendar, Users, Trash2, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { apiClient, type InviteResponse } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import NavigationMenu from "@/components/user-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function InvitesPage() {
  const { toast } = useToast()
  const [invites, setInvites] = useState<InviteResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadInvites()
  }, [])

  const loadInvites = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getInvites()
      setInvites(response.invites)
    } catch (error) {
      console.error("Error loading invites:", error)
      toast({
        title: "Error",
        description: "Failed to load your invites",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      await apiClient.deleteInvite(id)
      setInvites((prev) => prev.filter((invite) => invite.id !== id))
      toast({
        title: "Invite deleted",
        description: "Your invite has been successfully deleted",
      })
    } catch (error) {
      console.error("Error deleting invite:", error)
      toast({
        title: "Error",
        description: "Failed to delete invite",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-between items-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300">
                ✨ My Travel Invites
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <NavigationMenu />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-emerald-700 to-slate-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent mb-4">
              My Travel Invites
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Manage all your travel invitations in one place
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-purple-500 dark:to-indigo-500 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Loading your invites...</p>
              </div>
            </div>
          ) : invites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 rounded-3xl">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-purple-500/20 dark:to-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-10 h-10 text-green-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No invites yet</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-8 text-center max-w-md">
                You haven't created any travel invites yet. Create your first invite to get started!
              </p>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-purple-600 dark:to-indigo-600 hover:from-green-700 hover:to-emerald-700 dark:hover:from-purple-700 dark:hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Create Your First Invite
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invites.map((invite) => (
                <Card
                  key={invite.id}
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-0 shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                    {invite.cover_image_media ? (
                      <img
                        src={invite.cover_image_media || "/placeholder.svg"}
                        alt={invite.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 dark:from-purple-600/20 dark:to-indigo-600/20"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                      <h3 className="text-xl font-bold line-clamp-1">{invite.name}</h3>
                      <p className="text-sm opacity-90">
                        {new Date(invite.start_datetime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {invite.config.capacity} guests
                        </span>
                      </div>
                      <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <span className="text-xs font-medium text-green-700 dark:text-green-400">
                          {invite.config.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/invite/${invite.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border-white/20 dark:border-slate-600/20 hover:bg-white/80 dark:hover:bg-slate-700/80 rounded-xl"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteId(invite.id)}
                        className="bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border-white/20 dark:border-slate-600/20 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {invites.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Link href="/create">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-purple-600 dark:to-indigo-600 hover:from-green-700 hover:to-emerald-700 dark:hover:from-purple-700 dark:hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Create New Invite
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Delete Invite
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-300">
              Are you sure you want to delete this invite? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border-white/20 dark:border-slate-600/20 hover:bg-white/80 dark:hover:bg-slate-700/80 rounded-xl"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                if (deleteId) {
                  handleDelete(deleteId)
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
