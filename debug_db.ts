
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://drgyofnpaaatarqydagr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZ3lvZm5wYWFhdGFycXlkYWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDA4NDMsImV4cCI6MjA4NTExNjg0M30.gH3nmAQ9xLicZBla0ZuiKRaMu9Jg0dZEt0axxPzXWU4";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function test() {
  const { data, error } = await supabase.from('news').select('category_slug').limit(20)
  if (error) console.error(error)
  else console.log('Categories found in first 20 records:', [...new Set(data.map(i => i.category_slug))])
}

test()
