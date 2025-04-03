"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type CursorType = "default" | "text" | "link" | "button" | "image"

interface CursorContextType {
  cursorType: CursorType
  setCursorType: (type: CursorType) => void
}

const CursorContext = createContext<CursorContextType | undefined>(undefined)

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorType, setCursorType] = useState<CursorType>("default")

  return <CursorContext.Provider value={{ cursorType, setCursorType }}>{children}</CursorContext.Provider>
}

export function useCursor() {
  const context = useContext(CursorContext)
  if (context === undefined) {
    throw new Error("useCursor must be used within a CursorProvider")
  }
  return context
}

// Utility hooks for common cursor interactions
export function useCursorText() {
  const { setCursorType } = useCursor()
  return {
    onMouseEnter: () => setCursorType("text"),
    onMouseLeave: () => setCursorType("default"),
  }
}

export function useCursorLink() {
  const { setCursorType } = useCursor()
  return {
    onMouseEnter: () => setCursorType("link"),
    onMouseLeave: () => setCursorType("default"),
  }
}

