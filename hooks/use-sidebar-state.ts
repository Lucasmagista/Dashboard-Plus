"use client"

import { useEffect, useState } from "react"

export function useSidebarState() {
  const [isHydrated, setIsHydrated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    // Após hidratação, verificar o localStorage
    const stored = localStorage.getItem("sidebar:state")
    if (stored) {
      setIsOpen(stored === "true")
    }
  }, [])

  const toggleSidebar = (open: boolean) => {
    setIsOpen(open)
    localStorage.setItem("sidebar:state", String(open))
  }

  return {
    isHydrated,
    isOpen,
    setIsOpen: toggleSidebar,
  }
}
