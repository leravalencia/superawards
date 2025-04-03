"use client"

import type React from "react"

import { useState, useRef, type MouseEvent } from "react"
import Link from "next/link"

interface MagneticButtonProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function MagneticButton({ href, children, className = "" }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    // Limit the movement
    const maxDistance = 15
    const moveX = (distanceX / rect.width) * maxDistance
    const moveY = (distanceY / rect.height) * maxDistance

    setPosition({ x: moveX, y: moveY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div
      ref={buttonRef}
      className="relative inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={`inline-block bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-6 rounded-md transition-colors ${className}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.2s ease",
        }}
      >
        {children}
      </Link>
    </div>
  )
}

