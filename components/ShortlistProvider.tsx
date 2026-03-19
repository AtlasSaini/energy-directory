'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface ShortlistVendor {
  id: string
  company_name: string
  slug: string
  category?: string
}

interface ShortlistContextType {
  shortlist: ShortlistVendor[]
  addToShortlist: (vendor: ShortlistVendor) => void
  removeFromShortlist: (vendorId: string) => void
  clearShortlist: () => void
  isInShortlist: (vendorId: string) => boolean
  openDrawer: () => void
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
}

const ShortlistContext = createContext<ShortlistContextType | null>(null)

const STORAGE_KEY = 'energydirectory_shortlist'
const MAX_SHORTLIST = 10

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [shortlist, setShortlist] = useState<ShortlistVendor[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const openDrawer = useCallback(() => setDrawerOpen(true), [])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setShortlist(parsed)
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true)
  }, [])

  // Persist to localStorage whenever shortlist changes (after hydration)
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shortlist))
    } catch {
      // ignore storage errors
    }
  }, [shortlist, hydrated])

  const addToShortlist = useCallback((vendor: ShortlistVendor) => {
    setShortlist((prev) => {
      if (prev.length >= MAX_SHORTLIST) return prev
      if (prev.some((v) => v.id === vendor.id)) return prev
      const next = [...prev, vendor]
      // Auto-open drawer when first vendor is added
      if (prev.length === 0) setTimeout(() => setDrawerOpen(true), 100)
      return next
    })
  }, [])

  const removeFromShortlist = useCallback((vendorId: string) => {
    setShortlist((prev) => prev.filter((v) => v.id !== vendorId))
  }, [])

  const clearShortlist = useCallback(() => {
    setShortlist([])
  }, [])

  const isInShortlist = useCallback((vendorId: string) => {
    return shortlist.some((v) => v.id === vendorId)
  }, [shortlist])

  return (
    <ShortlistContext.Provider value={{
      shortlist,
      addToShortlist,
      removeFromShortlist,
      clearShortlist,
      isInShortlist,
      openDrawer,
      drawerOpen,
      setDrawerOpen,
    }}>
      {children}
    </ShortlistContext.Provider>
  )
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext)
  if (!ctx) throw new Error('useShortlist must be used within ShortlistProvider')
  return ctx
}
