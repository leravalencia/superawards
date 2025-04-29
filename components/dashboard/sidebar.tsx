"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Award, Calendar, Home, LogOut, Search, Settings, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="hidden border-r bg-muted/40 lg:block w-64 shrink-0">
      <div className="flex flex-col h-full">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Award className="h-6 w-6 text-primary" />
            <span className="text-xl">AwardPro</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === "/dashboard" && "bg-muted text-primary",
              )}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/awards"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === "/dashboard/awards" && "bg-muted text-primary",
              )}
            >
              <Award className="h-4 w-4" />
              Awards
            </Link>
            <Link
              href="/dashboard/search"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === "/dashboard/search" && "bg-muted text-primary",
              )}
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
            <Link
              href="/dashboard/calendar"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === "/dashboard/calendar" && "bg-muted text-primary",
              )}
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </Link>
            <Link
              href="/admin/import"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === "/admin/import" && "bg-muted text-primary",
              )}
            >
              <Upload className="h-4 w-4" />
              Import CSV
            </Link>
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === "/dashboard/settings" && "bg-muted text-primary",
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
