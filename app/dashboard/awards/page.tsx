"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Award, Download, Filter, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/client"
import { AwardsTable } from "@/components/dashboard/awards-table"
import { AwardsGrid } from "@/components/dashboard/awards-grid"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/context/user-context"
import { CSVUpload } from "@/components/dashboard/csv-upload"

export default function AwardsPage() {
  const { user } = useUser()
  const [view, setView] = useState<"table" | "grid">("table")
  const [awards, setAwards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [industries, setIndustries] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [filters, setFilters] = useState({
    industry: "all",
    location: "all",
    search: "",
  })

  const fetchAwards = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      let query = supabase
        .from("awards")
        .select("*")
        .eq("user_id", user.id)

      if (filters.industry !== "all") {
        query = query.ilike("industry", `%${filters.industry}%`)
      }

      if (filters.location !== "all") {
        query = query.ilike("location", `%${filters.location}%`)
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,industry.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching awards:", error)
        return
      }

      setAwards(data || [])

      // Extract unique industries and locations for filters
      if (data) {
        const uniqueIndustries = [...new Set(data.map((award) => award.industry))]
        const uniqueLocations = [...new Set(data.map((award) => award.location))]
        setIndustries(uniqueIndustries)
        setLocations(uniqueLocations)
      }
    } catch (error) {
      console.error("Error fetching awards:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAwards()
  }, [filters, user])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }))
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Awards Database</h1>
          <p className="text-muted-foreground">Browse and filter all available awards</p>
        </div>

        <div className="flex items-center gap-2">
          <CSVUpload onSuccess={fetchAwards} />
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search awards..."
              className="w-full pl-8"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>

          <Button type="submit" variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          <Button variant="outline" size="icon" className="h-9 w-9 md:hidden">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">View options</span>
          </Button>
        </form>

        <div className="hidden items-center gap-2 md:flex">
          <Select value={filters.industry} onValueChange={(value) => handleFilterChange("industry", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs defaultValue="table" className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table" onClick={() => setView("table")}>
                Table
              </TabsTrigger>
              <TabsTrigger value="grid" onClick={() => setView("grid")}>
                Grid
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {loading ? (
        <LoadingState view={view} />
      ) : awards.length > 0 ? (
        view === "table" ? (
          <AwardsTable awards={awards} />
        ) : (
          <AwardsGrid awards={awards} />
        )
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

function LoadingState({ view }: { view: "table" | "grid" }) {
  return view === "table" ? (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  ) : (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
      <Award className="h-10 w-10 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-medium">No awards found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Try adjusting your search or filter criteria to find what you're looking for.
      </p>
    </div>
  )
}
