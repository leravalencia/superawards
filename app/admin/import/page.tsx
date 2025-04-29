"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { importCsvData } from "@/lib/actions/import-actions"

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    count?: number
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "text/csv") {
        setFile(selectedFile)
        setResult(null)
      } else {
        setResult({
          success: false,
          message: "Please select a valid CSV file"
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("csvFile", file)

      const response = await importCsvData(formData)

      setResult({
        success: response.success,
        message: response.success
          ? `Successfully imported ${response.count} awards`
          : response.error || "Failed to import CSV data",
        count: response.count,
      })

      if (response.success) {
        setFile(null)
        // Reset file input
        const fileInput = document.getElementById('csv-upload') as HTMLInputElement
        if (fileInput) {
          fileInput.value = ''
        }
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred during import",
      })
      console.error("Error uploading CSV:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Import Awards CSV</CardTitle>
          <CardDescription>Upload a CSV file containing award data to import into the database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input type="file" id="csv-upload" accept=".csv" onChange={handleFileChange} className="hidden" />
            <label htmlFor="csv-upload" className="flex flex-col items-center justify-center cursor-pointer">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">{file ? file.name : "Click to upload CSV file"}</p>
              <p className="text-xs text-muted-foreground">Only CSV files are supported</p>
            </label>
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Import Successful" : "Import Failed"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">CSV Format Requirements</h3>
            <p className="text-sm text-muted-foreground mb-2">Your CSV file should have the following columns:</p>
            <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
              <li>name - Award name</li>
              <li>industry - Industry category</li>
              <li>location - Geographic location</li>
              <li>deadline - Submission deadline</li>
              <li>entry_fee - Cost to enter</li>
              <li>reputation_value - Prestige level (High, Very High, Highest)</li>
              <li>seo_rank - SEO ranking (1-10)</li>
              <li>online_mentions - Number of online mentions</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? "Importing..." : "Import CSV Data"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
