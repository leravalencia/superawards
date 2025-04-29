'use server'

import { createClient } from '@/lib/supabase/server'

export async function importCsvData(formData: FormData) {
  try {
    const csvFile = formData.get('csvFile') as File
    if (!csvFile) {
      return { success: false, error: 'No file provided' }
    }

    const text = await csvFile.text()
    const rows = text.split('\n').map(row => row.split(','))
    const headers = rows[0]
    const data = rows.slice(1)

    const supabase = await createClient()

    const { error } = await supabase
      .from('awards')
      .insert(
        data.map(row => ({
          title: row[0],
          category: row[1],
          description: row[2],
          status: 'active',
          deadline: row[3],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
      )

    if (error) {
      console.error('Error importing data:', error)
      return { success: false, error: error.message }
    }

    return { success: true, count: data.length }
  } catch (error: any) {
    console.error('Import error:', error)
    return { success: false, error: error.message }
  }
} 