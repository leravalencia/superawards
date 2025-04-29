'use server'

import { createClient } from '@/lib/supabase/server'

export async function importCsvData(formData: FormData) {
  try {
    const csvFile = formData.get('csvFile') as File
    if (!csvFile) {
      return { success: false, error: 'No file provided' }
    }

    const text = await csvFile.text()
    const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()))
    const headers = rows[0]
    const data = rows.slice(1)

    // Validate headers
    const requiredHeaders = ['name', 'industry', 'location', 'deadline', 'entry_fee', 'reputation_value', 'seo_rank', 'online_mentions']
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
    
    if (missingHeaders.length > 0) {
      return { success: false, error: `Missing required headers: ${missingHeaders.join(', ')}` }
    }

    const supabase = await createClient()

    // Map CSV data to database schema
    const awards = data.map(row => {
      const award: Record<string, any> = {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      headers.forEach((header, index) => {
        if (row[index]) {
          award[header] = row[index]
        }
      })
      
      return award
    }).filter(award => award.name) // Filter out empty rows

    const { error } = await supabase
      .from('awards')
      .insert(awards)

    if (error) {
      console.error('Error importing data:', error)
      return { success: false, error: error.message }
    }

    return { success: true, count: awards.length }
  } catch (error: any) {
    console.error('Import error:', error)
    return { success: false, error: error.message }
  }
} 