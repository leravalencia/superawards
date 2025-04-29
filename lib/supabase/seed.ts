import { supabase } from "./client"

export async function seedAwardsDatabase(csvData: string) {
  try {
    // Parse CSV data
    const lines = csvData.trim().split("\n")
    const headers = lines[0].split(",").map((header) => header.trim().toLowerCase().replace(/ /g, "_"))

    const awards = []

    for (let i = 1; i < lines.length; i++) {
      // Handle quoted values with commas inside them
      const row = lines[i]
      const values: string[] = []
      let inQuotes = false
      let currentValue = ""

      for (let j = 0; j < row.length; j++) {
        if (row[j] === '"' && (j === 0 || row[j - 1] !== "\\")) {
          inQuotes = !inQuotes
        } else if (row[j] === "," && !inQuotes) {
          values.push(currentValue.trim())
          currentValue = ""
        } else {
          currentValue += row[j]
        }
      }

      // Add the last value
      values.push(currentValue.trim())

      // Create award object
      const award: Record<string, any> = {}

      headers.forEach((header, index) => {
        if (index < values.length) {
          let value = values[index]

          // Remove surrounding quotes if present
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1)
          }

          // Handle categories as an array
          if (header === "categories") {
            award[header] = value ? value.split(",").map((cat: string) => cat.trim()) : []
          }
          // Handle numeric values
          else if (header === "seo_rank") {
            award[header] = Number.parseInt(value) || 0
          }
          // Handle all other fields as strings
          else {
            award[header] = value
          }
        }
      })

      awards.push(award)
    }

    // Insert awards into Supabase
    const { data, error } = await supabase.from("awards").insert(awards).select()

    if (error) {
      console.error("Error seeding awards:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error parsing CSV:", error)
    return { success: false, error }
  }
}
