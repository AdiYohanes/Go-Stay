
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Simple .env parser
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
  const { data, error } = await supabase
    .from('properties')
    .select('id, title, image_urls')
    .ilike('title', '%Desert Dome%')

  if (error) {
    console.error('Error:', error)
  } else {
    // If no property found, create one for testing
    if (!data || data.length === 0) {
        console.log("No 'Desert Dome' found. Creating one...")
        const { data: newProp, error: createError } = await supabase.from('properties').insert({
            title: 'Desert Dome Glamping',
            description: 'Experience the magic of the desert in our luxurious geodesic domes. Stargaze from your bed and enjoy the silence of nature.',
            price_per_night: 250,
            location: 'Joshua Tree, CA',
            max_guests: 4,
            amenities: ['Wifi', 'AC', 'Pool', 'Parking', 'Kitchen'],
            image_urls: []
        }).select().single()
        
        if (createError) console.error('Error creating property:', createError)
        else console.log('Created property:', JSON.stringify(newProp, null, 2))
    } else {
        console.log('Found properties:', JSON.stringify(data, null, 2))
    }
  }
}

main()
