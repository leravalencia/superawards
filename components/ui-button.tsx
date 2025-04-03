"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import Link from "next/link"

interface ButtonProps {
  children: React.ReactNode
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  href?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

export default function Button({
  children,
  variant = "default",
  size = "default",
  className,
  href,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  // Base styles that apply to all buttons
  const baseStyles =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  // Variant styles
  const variantStyles = {
    default: "bg-red-600 text-white hover:bg-red-700",
    outline:
      "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800",
    ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
    link: "text-red-600 underline-offset-4 hover:underline",
  }

  // Size styles
  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  // Combine all styles
  const buttonStyles = cn(baseStyles, variantStyles[variant], sizeStyles[size], className)

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href} className={buttonStyles}>
        {children}
      </Link>
    )
  }

  // Otherwise render as button
  return (
    <button type={type} className={buttonStyles} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

