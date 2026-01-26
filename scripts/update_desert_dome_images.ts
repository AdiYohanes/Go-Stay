
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Simple .env parser to avoid checking node_modules
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local')
    const envFile = fs.readFileSync(envPath, 'utf8')
    const envVars: Record<string, string> = {}
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        let value = match[2].trim()
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        envVars[match[1].trim()] = value
      }
    })
    return envVars
  } catch (e) {
    console.error('Error loading .env.local', e)
    return {}
  }
}

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const images = [
    '/properties/desert-dome/1.png',
    '/properties/desert-dome/2.png',
    '/properties/desert-dome/3.png',
    '/properties/desert-dome/4.png',
    '/properties/desert-dome/5.png'
  ]

  console.log('Updating Desert Dome images to:', images)

  const { data, error } = await supabase
    .from('properties')
    .update({ image_urls: images })
    .ilike('title', '%Desert Dome%')
    .select()

  if (error) {
    console.error('Error updating property:', error)
  } else {
    console.log('Successfully updated property images:', JSON.stringify(data, null, 2))
  }
}

main()
