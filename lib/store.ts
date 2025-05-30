"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface InviteData {
  theme: {
    type: "image" | "video"
    file: File | null
    preview: string
  }
  eventName: string
  startDate: string
  eventDescription: string
  capacity: number
  requireApproval: boolean
}

interface InviteStore {
  inviteData: InviteData | null
  setInviteData: (data: InviteData) => void
  clearInviteData: () => void
}

export const useInviteStore = create<InviteStore>()(
  persist(
    (set) => ({
      inviteData: null,
      setInviteData: (data) => set({ inviteData: data }),
      clearInviteData: () => set({ inviteData: null }),
    }),
    {
      name: "invite-storage",
    },
  ),
)
