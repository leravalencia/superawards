"use client"

import { useState } from "react"
import { Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useUser } from "@/context/user-context"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface CSVUploadProps {
  onSuccess?: () => void
}

export function CSVUpload({ onSuccess }: CSVUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()
  const supabase = createClientComponentClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setError(null)
    } else {
      setError("Please select a valid CSV file")
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file || !user) return

    setLoading(true)
    setError(null)

    try {
      const text = await file.text()
      const rows = text.split("\n")
      const headers = rows[0].split(",").map(h => h.trim())
      
      // Validate required headers
      const requiredHeaders = ["name", "industry", "location", "deadline", "entry_fee", "reputation_value", "seo_rank", "online_mentions"]
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`)
      }

      // Parse CSV data
      const awards = rows.slice(1).map(row => {
        const values = row.split(",").map(v => v.trim())
        const award: Record<string, any> = {
          user_id: user.id,
          created_at: new Date().toISOString()
        }
        
        headers.forEach((header, index) => {
          award[header] = values[index]
        })
        
        return award
      }).filter(award => award.name) // Filter out empty rows

      // Insert awards into database
      const { error: insertError } = await supabase
        .from("awards")
        .insert(awards)

      if (insertError) throw insertError

      setFile(null)
      onSuccess?.()
    } catch (err) {
      console.error("Error uploading awards:", err)
      setError(err instanceof Error ? err.message : "Failed to upload awards")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
        />
        <label htmlFor="csv-upload">
          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={loading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Select CSV File
          </Button>
        </label>
        {file && (
          <Button
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Awards"}
          </Button>
        )}
      </div>

      {file && (
        <p className="text-sm text-muted-foreground">
          Selected file: {file.name}
        </p>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
} 