import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bvxkpspovcnufyffeppc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2eGtwc3BvdmNudWZ5ZmZlcHBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4OTQyNTgsImV4cCI6MjA2NjQ3MDI1OH0.gQ_yG9XSM0I78VZak1rDbvkckrtrW7-734PSWLc0OBs'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})