import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kaqxifjcrxistggfniks.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthcXhpZmpjcnhpc3RnZ2ZuaWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjQ5OTAsImV4cCI6MjA5NjE0MDk5MH0.2SFk1fD1mAjYApibozekBgPBHu-pI9QCMeP6vPnvco4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
