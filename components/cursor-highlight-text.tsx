"use client"

import type React from "react"

import { useState, useRef, type MouseEvent } from "react"

interface CursorHighlightTextProps {
  children: React.ReactNode
  className?: string
}

export default function CursorHighlightText({ children, className = "" }: CursorHighlightTextProps) {
  const textRef = useRef<HTMLDivElement>(null)
  const [highlight, setHighlight] = useState({ opacity: 0, x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent) => {
    if (!textRef.current) return

    const rect = textRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setHighlight({ opacity: 1, x, y })
  }

  const handleMouseLeave = () => {
    setHighlight({ ...highlight, opacity: 0 })
  }

  return (
    <div
      ref={textRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Highlight effect */}
      <div
        className="absolute pointer-events-none bg-red-500 mix-blend-multiply rounded-full blur-xl transition-opacity duration-300"
        style={{
          width: "150px",
          height: "150px",
          transform: `translate(${highlight.x - 75}px, ${highlight.y - 75}px)`,
          opacity: highlight.opacity,
        }}
      />

      {/* Text content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

