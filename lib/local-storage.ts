"use client"

/**
 * Enhanced localStorage wrapper with data persistence for invites
 * Handles both invite data and form drafts with proper error handling
 */

export interface StoredInvite {
  id: string
  data: any
  createdAt: string
  updatedAt: string
}

export const localStorageHelper = {
  // Basic localStorage operations
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") {
      return null
    }
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return null
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === "undefined") {
      return false
    }
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.error("Error writing to localStorage:", error)
      return false
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === "undefined") {
      return false
    }
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error("Error removing from localStorage:", error)
      return false
    }
  },

  // Invite-specific operations
  saveInvite: (invite: any): string => {
    const id = invite.id || crypto.randomUUID()
    const storedInvite: StoredInvite = {
      id,
      data: invite,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const success = localStorageHelper.setItem(`invite_${id}`, JSON.stringify(storedInvite))
    if (success) {
      // Also update the invites index
      localStorageHelper.updateInvitesIndex(id)
      console.log("✅ Invite saved to localStorage:", id)
      return id
    } else {
      throw new Error("Failed to save invite to localStorage")
    }
  },

  getInvite: (id: string): any | null => {
    const stored = localStorageHelper.getItem(`invite_${id}`)
    if (stored) {
      try {
        const parsedInvite: StoredInvite = JSON.parse(stored)
        return parsedInvite.data
      } catch (error) {
        console.error("Error parsing stored invite:", error)
        return null
      }
    }
    return null
  },

  getAllInvites: (): any[] => {
    const invitesIndex = localStorageHelper.getInvitesIndex()
    const invites: any[] = []

    for (const id of invitesIndex) {
      const invite = localStorageHelper.getInvite(id)
      if (invite) {
        invites.push(invite)
      }
    }

    // Sort by creation date (newest first)
    return invites.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  deleteInvite: (id: string): boolean => {
    const success = localStorageHelper.removeItem(`invite_${id}`)
    if (success) {
      // Also remove from invites index
      localStorageHelper.removeFromInvitesIndex(id)
      console.log("🗑️ Invite deleted from localStorage:", id)
    }
    return success
  },

  // Invites index management
  getInvitesIndex: (): string[] => {
    const index = localStorageHelper.getItem("invites_index")
    if (index) {
      try {
        return JSON.parse(index)
      } catch (error) {
        console.error("Error parsing invites index:", error)
        return []
      }
    }
    return []
  },

  updateInvitesIndex: (id: string): void => {
    const index = localStorageHelper.getInvitesIndex()
    if (!index.includes(id)) {
      index.push(id)
      localStorageHelper.setItem("invites_index", JSON.stringify(index))
    }
  },

  removeFromInvitesIndex: (id: string): void => {
    const index = localStorageHelper.getInvitesIndex()
    const filteredIndex = index.filter((inviteId) => inviteId !== id)
    localStorageHelper.setItem("invites_index", JSON.stringify(filteredIndex))
  },

  // Form draft operations
  saveDraft: (formData: any): boolean => {
    const draft = {
      data: formData,
      savedAt: new Date().toISOString(),
    }
    const success = localStorageHelper.setItem("invite_draft", JSON.stringify(draft))
    if (success) {
      console.log("💾 Draft saved to localStorage")
    }
    return success
  },

  getDraft: (): any | null => {
    const draft = localStorageHelper.getItem("invite_draft")
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft)
        return parsedDraft.data
      } catch (error) {
        console.error("Error parsing draft:", error)
        return null
      }
    }
    return null
  },

  clearDraft: (): boolean => {
    return localStorageHelper.removeItem("invite_draft")
  },

  // Utility functions
  clear: (): boolean => {
    if (typeof window === "undefined") {
      return false
    }
    try {
      localStorage.clear()
      console.log("🧹 localStorage cleared")
      return true
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      return false
    }
  },

  getStorageInfo: (): { used: number; available: number; total: number } => {
    if (typeof window === "undefined") {
      return { used: 0, available: 0, total: 0 }
    }

    try {
      // Estimate storage usage
      let used = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length
        }
      }

      // Most browsers have ~5-10MB limit for localStorage
      const total = 5 * 1024 * 1024 // 5MB estimate
      const available = total - used

      return { used, available, total }
    } catch (error) {
      console.error("Error calculating storage info:", error)
      return { used: 0, available: 0, total: 0 }
    }
  },
}
